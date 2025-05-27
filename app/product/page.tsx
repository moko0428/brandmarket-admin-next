'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import Camera from './components/camera';
import { visionApiReadyImageAtom } from './atoms/camera-atom';
import { detectText } from './actions';
import Image from 'next/image';
import { ReceiptDataType } from './types/receipt-type';
import { ocrResultAtom, editableReceiptAtom } from './atoms/camera-atom';
import { ReceiptEditor } from './components/receipt-editor';
interface TextResult {
  parsedData?: ReceiptDataType;
  text?: string;
}

interface TextDetectionError extends Error {
  message: string;
}

export default function ReceiptPage() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<TextResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visionApiReady] = useAtom(visionApiReadyImageAtom);
  const [, setOcrResult] = useAtom(ocrResultAtom);
  const [, setEditableReceipt] = useAtom(editableReceiptAtom);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
  };

  const analyzeText = () => {
    analyzeImage();
  };
  const analyzeImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await detectText(visionApiReady);

      if (result.success && result.text && result.parsedData) {
        setTextResult({
          text: result.text,
          parsedData: result.parsedData,
        });
        setOcrResult({
          rawText: result.text,
          parsedData: result.parsedData,
        });
        setEditableReceipt(result.parsedData);
      } else {
        setError(result.error || '알 수 없는 오류가 발생했습니다');
      }
    } catch (err: unknown) {
      const error = err as TextDetectionError;
      setError(error.message || '텍스트 감지 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">텍스트 인식</h1>

      {!showCamera && !isLoading && (
        <div className="flex gap-4">
          <button
            onClick={() => setShowCamera(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            카메라 열기
          </button>
          <button
            onClick={analyzeText}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            텍스트 분석
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3">텍스트 감지 중...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
          <Camera
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        </div>
      )}

      {capturedImage && textResult && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">분석 결과</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">촬영된 이미지</h3>
              <Image
                src={capturedImage}
                alt="촬영된 이미지"
                width={500}
                height={500}
                className="max-w-full rounded-lg shadow-md"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">영수증 정보</h3>
              {textResult.parsedData ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">매장명:</p>
                    <p>{textResult.parsedData.storeName}</p>
                  </div>

                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2">품명</th>
                        <th className="py-2">단가</th>
                        <th className="py-2">수량</th>
                        <th className="py-2">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {textResult.parsedData.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2">{item.price}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">{item.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>인식된 정보가 없습니다.</p>
              )}

              <div>
                전체 텍스트
                {textResult?.text}
              </div>
              <div>
                추출된 텍스트
                {textResult?.parsedData?.items.map((item) => (
                  <div key={item.name}>
                    {item.name} {item.price} {item.quantity} {item.totalPrice}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCamera(true)}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            다시 촬영하기
          </button>
        </div>
      )}

      <ReceiptEditor />
    </div>
  );
}
