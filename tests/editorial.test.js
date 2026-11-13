import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePost } from '../src/editorial.js';
import { publishedToday } from '../src/history.js';

test('rejects duplicate content', () => {
  const post = 'Good automation starts with clear responsibilities and useful feedback.';
  assert.equal(validatePost(post, [{ text: post }]).ok, false);
});

test('rejects promotional claims', () => {
  assert.equal(validatePost('This tool offers guaranteed profit to everyone.').ok, false);
});

test('counts only published posts on the same day', () => {
  assert.equal(publishedToday([{ status: 'published', at: '2026-11-13T10:00:00Z' }, { status: 'preview', at: '2026-11-13T12:00:00Z' }], new Date('2026-11-13T15:00:00Z')), 1);
});
