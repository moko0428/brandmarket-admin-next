import { atom } from 'jotai';
import { ReceiptDataType } from '../types/receipt-type';

// 카메라로 촬영한 이미지를 base64 형식으로 저장
export const cameraImageBase64Atom = atom<string | null>(null);

// ocr 결과 저장
export const ocrResultAtom = atom<{
  rawText: string; // vision api 결과
  parsedData: ReceiptDataType; // 파싱된 데이터
} | null>(null);

// 사용자가 수정한 영수증 데이터를 저장
export const editableReceiptAtom = atom<ReceiptDataType>({
  storeName: '',
  items: [],
});

// 이미지 base64 데이터를 읽고 쓸 수 있는 상태
export const cameraImageBase64WritableAtom = atom(
  (get) => get(cameraImageBase64Atom),
  (get, set, base64Image: string | null) => {
    set(cameraImageBase64Atom, base64Image);
  }
);

// vision api 요청을 위해 이미지 데이터를 가공
// 'data:image/...' 프리픽스를 제거한 순수 base64 데이터 반환
export const visionApiReadyImageAtom = atom((get) => {
  const base64Image = get(cameraImageBase64Atom);
  if (!base64Image) return null;

  return base64Image.split(',')[1];
});

// vision api 요청 객체를 생성
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
