import 'dotenv/config';

export const config = {
  openaiKey: process.env.OPENAI_API_KEY || '',
  textModel: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
  imageModel: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
  liveEnabled: process.env.ENABLE_LIVE_POSTING === 'true',
  dailyLimit: Math.min(10, Math.max(1, Number(process.env.MAX_POSTS_PER_DAY) || 2)),
  x: {
    appKey: process.env.X_API_KEY || '',
    appSecret: process.env.X_API_SECRET || '',
    accessToken: process.env.X_ACCESS_TOKEN || '',
    accessSecret: process.env.X_ACCESS_SECRET || '',
  },
};
