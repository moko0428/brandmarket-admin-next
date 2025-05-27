'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cameraImageBase64WritableAtom } from '../atoms/camera-atom';

interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

interface CameraProps {
  onCapture?: (imageData: string) => void;
  onClose?: () => void;
}

export default function Camera({ onCapture, onClose }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [, setIsPWAInstalled] = useState(false);

  const [, setCameraImageBase64] = useAtom(cameraImageBase64WritableAtom);

  useEffect(() => {
    setIsPWAInstalled(
      window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as SafariNavigator).standalone ||
        document.referrer.includes('android-app://')
    );

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setError('');
      }
    } catch (err) {
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      console.error('카메라 에러:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');

      setCameraImageBase64(imageData);

      if (onCapture) {
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto">
      {error && (
        <div className="absolute top-5 left-0 right-0 text-center bg-red-600 bg-opacity-70 text-white py-2.5 z-[1001]">
          {error}
        </div>
      )}

      <div className="flex h-[700px] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          onCanPlay={() => setCameraActive(true)}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-around py-5 px-5 bg-black bg-opacity-70">
        <button
          onClick={captureImage}
          disabled={!cameraActive}
          className={`py-3 px-6 rounded-full text-base font-bold ${
            cameraActive ? 'bg-white text-black' : 'bg-gray-600 text-gray-400'
          }`}
        >
          사진 촬영
        </button>

        <button
          onClick={onClose}
          className="py-3 px-6 bg-transparent text-white border border-white rounded-full text-base"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
