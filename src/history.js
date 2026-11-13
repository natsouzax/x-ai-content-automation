import fs from 'node:fs';
import path from 'node:path';

const file = path.join('data', 'history.json');

export function readHistory() {
  if (!fs.existsSync(file)) return [];
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('Invalid history format');
  return parsed;
}

export function saveRecord(record) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const history = readHistory();
  history.push(record);
  fs.writeFileSync(file, JSON.stringify(history.slice(-100), null, 2));
}

export function publishedToday(history, date = new Date()) {
  const today = date.toISOString().slice(0, 10);
  return history.filter((item) => item.status === 'published' && item.at?.startsWith(today)).length;
}
