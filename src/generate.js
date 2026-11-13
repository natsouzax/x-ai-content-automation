import OpenAI from 'openai';
import { topics } from './editorial.js';

export async function generateText(apiKey, model, previous = []) {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  if (!apiKey || apiKey.startsWith('replace-')) {
    return `Useful tech reminder: ${topic} works best when your team has clear processes, measurable goals, and room to review what the automation produces.`;
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'Write neutral, accurate, useful educational posts for a generic technology community. Never mention brands, customers, financial returns or private information. Return only the post, under 270 characters.' },
      { role: 'user', content: `Topic: ${topic}. Avoid repeating these examples: ${previous.slice(-3).map((p) => p.text).join(' | ')}` },
    ],
    max_tokens: 130,
  });
  return (response.choices[0]?.message?.content || '').trim();
}

export async function generateVisual(apiKey, model, text) {
  if (!apiKey || apiKey.startsWith('replace-')) return null;
  const client = new OpenAI({ apiKey });
  const result = await client.images.generate({
    model,
    prompt: `Create an original minimalist editorial illustration about this technology idea: ${text}. No logos, brands, real people, or lettering. Landscape composition.`,
    size: '1024x1024',
  });
  const encoded = result.data?.[0]?.b64_json;
  if (!encoded) throw new Error('Image generation returned no image data');
  return Buffer.from(encoded, 'base64');
}
