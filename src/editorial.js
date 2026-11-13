export const topics = [
  'practical digital security',
  'software development habits',
  'responsible AI adoption',
  'automation for small teams',
  'privacy by design',
  'open-source collaboration',
];

export function validatePost(text, previous = []) {
  if (typeof text !== 'string' || text.trim().length < 20 || text.length > 270) {
    return { ok: false, reason: 'Post must be 20–270 characters.' };
  }
  if (previous.some((item) => item.text.trim().toLowerCase() === text.trim().toLowerCase())) {
    return { ok: false, reason: 'Duplicate of a previous post.' };
  }
  if (/\b(guaranteed profit|buy now|risk-free investment)\b/i.test(text)) {
    return { ok: false, reason: 'Disallowed claim detected.' };
  }
  return { ok: true };
}
