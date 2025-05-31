'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import Camera from '../components/camera';
import { visionApiReadyImageAtom } from '../atoms/camera-atom';
import { detectText } from '../actions';
import Image from 'next/image';
import { ReceiptDataType } from '../types/receipt-type';
import { ocrResultAtom, editableReceiptAtom } from '../atoms/camera-atom';
import { ReceiptEditor } from '../components/receipt-editor';
import QrCodeBox from '../components/qr-code-box';
import Link from 'next/link';
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
  const [showQr, setShowQr] = useState(false);
  const [visionApiReady] = useAtom(visionApiReadyImageAtom);
  const [, setOcrResult] = useAtom(ocrResultAtom);
  const [, setEditableReceipt] = useAtom(editableReceiptAtom);
  const cameraUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/camera?mode=receipt`
      : '';
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
    <div className="mx-auto p-4">
      <Link href="/product">되돌아가기</Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">영수증 분석</h1>
        <small>영수증의 품목, 단가, 수량, 총 금액을 추출합니다.</small>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">
          카메라 열기를 통해 영수증을 촬영해주세요.
        </h1>
        <small>영수증의 품목, 단가, 수량, 총 금액을 추출합니다.</small>
        <small>촬영 후 텍스트 분석을 눌러 텍스트 분석을 진행하세요.</small>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {!showCamera && !isLoading && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setTextResult(null);
                  setCapturedImage(null);
                  // setShowCamera(true);
                  setShowQr(!showQr);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                카메라 열기 / 재촬영
              </button>

              <button
                onClick={analyzeText}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                텍스트 분석
              </button>
            </div>
          )}
        </div>
        <aside>
          {showQr && <QrCodeBox value={cameraUrl} label="영수증 스캐너 열기" />}
        </aside>
      </div>

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

          {/* md:grid-cols-2 */}
          <div className="grid grid-cols-1 gap-6">
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
              {textResult.parsedData ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">영수증 정보</h3>
                  <div className="divide-y divide-gray-200">
                    {textResult.parsedData.items.map((item, index) => (
                      <div key={index} className="py-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <div className="mt-1 text-sm text-gray-500">
                              단가: {item.price.toLocaleString()}원
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {item.totalPrice.toLocaleString()}원
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              수량: {item.quantity}개
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">총 금액</span>
                      <span className="font-bold text-lg">
                        {textResult.parsedData.items
                          .reduce((sum, item) => sum + item.totalPrice, 0)
                          .toLocaleString()}
                        원
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>인식된 정보가 없습니다. 다시 촬영해주세요.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="">{textResult && !isLoading && <ReceiptEditor />}</div>
    </div>
  );
}
