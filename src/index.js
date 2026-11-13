import { config } from './config.js';
import { validatePost } from './editorial.js';
import { readHistory, saveRecord, publishedToday } from './history.js';
import { generateText, generateVisual } from './generate.js';
import { publishToX } from './publish.js';
import fs from 'node:fs';

const type = process.argv[2] === 'visual' ? 'visual' : 'text';
const requestedPublish = process.argv.includes('--publish');
const live = requestedPublish && config.liveEnabled;

if (requestedPublish && !config.liveEnabled) {
  throw new Error('Live publishing is disabled. Set ENABLE_LIVE_POSTING=true to opt in.');
}

const history = readHistory();
if (live && publishedToday(history) >= config.dailyLimit) {
  throw new Error('Daily publication limit reached.');
}

let text;
for (let attempt = 0; attempt < 3; attempt++) {
  const candidate = await generateText(config.openaiKey, config.textModel, history);
  if (validatePost(candidate, history).ok) { text = candidate; break; }
}
if (!text) throw new Error('Could not generate a valid, non-duplicate post');

// Image generation has a cost, so it runs only when explicitly requested.
const image = type === 'visual' ? await generateVisual(config.openaiKey, config.imageModel, text) : null;
console.log(`\n[${live ? 'PUBLISH' : 'PREVIEW'}] ${type.toUpperCase()}\n${text}\nImage generated: ${Boolean(image)}`);

if (image && !live) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/preview.png', image);
  console.log('Image preview saved to data/preview.png');
}

if (live) {
  await publishToX(text, image, config.x);
  saveRecord({ text, type, status: 'published', at: new Date().toISOString() });
  console.log('Published successfully.');
} else {
  console.log('Preview only. Nothing was published.');
}
