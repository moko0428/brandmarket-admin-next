'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { drawerOpenAtom } from '../atoms/drawer-atom';

interface DrawerProps {
  children: React.ReactNode;
}

export default function Drawer({ children }: DrawerProps) {
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);
  const lastOffsetRef = useRef(0);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const CLOSE = vh * 0.15;
  const MIN_HEIGHT = 140;
  const MAX_HEIGHT = vh * 0.8;

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      setOffsetY(lastOffsetRef.current);
    }
  }, [drawerOpen]);

  const onHandlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    startY.current = e.clientY;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!dragging) return;

    const currentStartY = startY.current;

    const move = (e: PointerEvent) => {
      if (currentStartY == null) return;
      const delta = e.clientY - currentStartY;
      setDragY(delta);
    };

    const up = () => {
      const final = offsetY + dragY;
      const currentHeight = MIN_HEIGHT - final;
      const shouldClose = final >= CLOSE || currentHeight < vh * 0.1;

      if (shouldClose) {
        lastOffsetRef.current = 0;
        setDrawerOpen(false);
      } else {
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
  }, [
    dragging,
    dragY,
    offsetY,
    setDrawerOpen,
    CLOSE,
    MIN_HEIGHT,
    MAX_HEIGHT,
    vh,
  ]);

  useEffect(() => {
    if (!drawerOpen) {
      setDragY(0);
      setDragging(false);
    }
  }, [drawerOpen]);

  const currentHeight = MIN_HEIGHT - (offsetY + dragY);

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/0 transition-opacity duration-200
          ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        onPointerDown={onHandlePointerDown}
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-xl
          ${dragging ? '' : 'transition-all duration-150'}`}
        style={{
          height: `${currentHeight}px`,
          maxHeight: '80vh',
          transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="flex justify-center py-3 flex-shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </>
  );
}
