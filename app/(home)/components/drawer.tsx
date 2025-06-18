'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { drawerOpenAtom } from '../atoms/drawer-atom';

interface DrawerProps {
  children: React.ReactNode;
}

export default function Drawer({ children }: DrawerProps) {
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0); // 실시간 이동값
  const [offsetY, setOffsetY] = useState(0); // 고정된 위치
  const [dragging, setDragging] = useState(false);

  /* jotai 상태 사용 */
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);

  /* 마지막 드래그 위치를 기억 */
  const lastOffsetRef = useRef(0);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const CLOSE = vh * 0.15; // 15vh 이상 내리면 닫힘
  const MIN_HEIGHT = 140; // (px)
  const MAX_HEIGHT = vh * 0.8; // 최대

  /* 스크롤 락 */
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  /* Drawer가 열릴 때 직전 위치로 복원 (처음에는 최소 높이) */
  useEffect(() => {
    if (drawerOpen) {
      setOffsetY(lastOffsetRef.current);
    }
  }, [drawerOpen]);

  /* 드래그 시작 */
  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  /* 드래그 진행/종료 */
  useEffect(() => {
    if (!dragging) return;

    const move = (e: PointerEvent) => {
      if (startY.current == null) return;
      const delta = e.clientY - startY.current;
      setDragY(delta);
    };

    const up = () => {
      const final = offsetY + dragY;

      if (final >= CLOSE) {
        /* 충분히 내려서 닫는 경우 → 위치 초기화 */
        lastOffsetRef.current = 0;
        setDrawerOpen(false); // jotai 닫기
      } else {
        /* 최소/최대 높이 제한 */
        const currentHeight = MIN_HEIGHT - final;
        const clampedHeight = Math.max(
          MIN_HEIGHT,
          Math.min(currentHeight, MAX_HEIGHT)
        );
        const clampedOffset = MIN_HEIGHT - clampedHeight;

        setOffsetY(clampedOffset);
        lastOffsetRef.current = clampedOffset;
      }

      setDragY(0);
      setDragging(false);
      startY.current = null;
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging, dragY, offsetY, setDrawerOpen, CLOSE, MIN_HEIGHT, MAX_HEIGHT]);

  /* 닫히면 드래그 상태만 초기화 (위치는 유지) */
  useEffect(() => {
    if (!drawerOpen) {
      setDragY(0);
      setDragging(false);
    }
  }, [drawerOpen]);

  /* 현재 Drawer 높이 계산 */
  const currentHeight = MIN_HEIGHT - (offsetY + dragY);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/0 transition-opacity duration-200
          ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer 본체 */}
      <div
        onPointerDown={onPointerDown}
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-xl overflow-hidden
          ${dragging ? '' : 'transition-all duration-150'}`}
        style={{
          height: `${currentHeight}px`,
          maxHeight: '80vh',
          transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* 핸들바 (드래그 전용 영역) */}
        <div
          className="flex justify-center py-3 flex-shrink-0"
          // onPointerDown={onPointerDown}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* 매장 리스트 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-0">{children}</div>
      </div>
    </>
  );
}
