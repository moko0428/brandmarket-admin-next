import { ImageAnnotatorClient } from '@google-cloud/vision';

export const googleVisionClient = new ImageAnnotatorClient({
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY,
    client_id: process.env.GCP_CLIENT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
  },
});
