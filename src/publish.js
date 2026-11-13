import { TwitterApi } from 'twitter-api-v2';

export async function publishToX(text, imageBuffer, credentials) {
  if (Object.values(credentials).some((value) => !value || value.startsWith('replace-'))) {
    throw new Error('Valid X API credentials are required for publishing');
  }
  const client = new TwitterApi(credentials);
  if (imageBuffer) {
    const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' });
    return client.v2.tweet({ text, media: { media_ids: [mediaId] } });
  }
  return client.v2.tweet(text);
}
