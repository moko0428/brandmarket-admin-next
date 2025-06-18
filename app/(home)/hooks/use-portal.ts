import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function usePortal(id = '__drawer_root__') {
  /* ① 첫 렌더에서 div 준비 → createPortal 즉시 가능 */
  const elRef = useRef<HTMLElement | null>(
    typeof window !== 'undefined' ? document.createElement('div') : null
  );
  if (elRef.current && !elRef.current.id) elRef.current.id = id;

  /* ② 마운트 시 body에 부착, 언마운트 시 정리 */
  useEffect(() => {
    if (!elRef.current) return;
    let root = document.getElementById(id);
    if (!root) {
      root = document.createElement('div');
      root.id = id;
      document.body.appendChild(root);
    }
    root.appendChild(elRef.current);
    return () => {
      if (elRef.current && root.contains(elRef.current))
        root.removeChild(elRef.current);
      if (root.childElementCount === 0) root.remove(); // 자식 없으면 root 제거
    };
  }, [id]);

  /* ③ children을 포털로 렌더 */
  return (children: React.ReactNode) =>
    elRef.current ? createPortal(children, elRef.current) : null;
}
