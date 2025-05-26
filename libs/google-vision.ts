import { ImageAnnotatorClient } from '@google-cloud/vision';

export const googleVisionClient = new ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});
