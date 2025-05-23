import { ImageAnnotatorClient } from '@google-cloud/vision';

export const googleVisionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH,
});

export const ClientVision = new ImageAnnotatorClient({
  keyFilename: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_KEY_PATH,
});
