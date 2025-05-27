import { atom } from 'jotai';
import { ReceiptDataType } from '../types/receipt-type';

export const cameraImageBase64Atom = atom<string | null>(null);

export const ocrResultAtom = atom<{
  rawText: string;
  parsedData: ReceiptDataType;
} | null>(null);

export const editableReceiptAtom = atom<ReceiptDataType>({
  storeName: '',
  items: [],
});

export const cameraImageBase64WritableAtom = atom(
  (get) => get(cameraImageBase64Atom),
  (get, set, base64Image: string | null) => {
    set(cameraImageBase64Atom, base64Image);
  }
);

export const visionApiReadyImageAtom = atom((get) => {
  const base64Image = get(cameraImageBase64Atom);
  if (!base64Image) return null;

  return base64Image.split(',')[1];
});

export const visionApiRequestAtom = atom((get) => {
  const base64Content = get(visionApiReadyImageAtom);
  if (!base64Content) return null;

  return {
    requests: [
      {
        image: {
          content: base64Content,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 10,
          },
        ],
      },
    ],
  };
});
