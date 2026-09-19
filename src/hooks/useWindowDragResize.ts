import { useState, useEffect, useRef, useCallback } from 'react';

export type PositionPreset = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface UseWindowDragResizeOptions {
  buttonSize?: number; // default 56px
  defaultWidth?: number; // default 420px
  defaultHeight?: number; // default 580px
  minWidth?: number; // default 320px
  maxWidth?: number; // default 700px
  minHeight?: number; // default 420px
  maxHeight?: number; // default 850px
  margin?: number; // default 16px
  initialPreset?: PositionPreset;
}

export function useWindowDragResize(options: UseWindowDragResizeOptions = {}) {
  const {
    buttonSize = 56,
    defaultWidth = 420,
    defaultHeight = 580,
    minWidth = 320,
    maxWidth = 700,
    minHeight = 420,
    maxHeight = 850,
    margin = 16,
    initialPreset = 'bottom-right',
  } = options;

  const [preset, setPreset] = useState<PositionPreset>(initialPreset);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [winPos, setWinPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [winSize, setWinSize] = useState<{ width: number; height: number }>({
    width: defaultWidth,
    height: defaultHeight,
  });

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isBtnDragging, setIsBtnDragging] = useState<boolean>(false);
  const [isWinDragging, setIsWinDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const btnWasDraggedRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);

  // Compute preset position based on container size and viewport
  const calculatePresetPos = useCallback(
    (presetName: PositionPreset, width: number, height: number) => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      let x = vw - width - margin;
      let y = vh - height - margin;

      switch (presetName) {
        case 'bottom-left':
          x = margin;
          y = vh - height - margin;
          break;
        case 'top-right':
          x = vw - width - margin;
          y = margin;
          break;
        case 'top-left':
          x = margin;
          y = margin;
          break;
        case 'center':
          x = Math.max(margin, (vw - width) / 2);
          y = Math.max(margin, (vh - height) / 2);
          break;
        case 'bottom-right':
        default:
          x = vw - width - margin;
          y = vh - height - margin;
          break;
      }

      // Clamp coordinates
      const clampedX = Math.max(margin, Math.min(x, vw - width - margin));
      const clampedY = Math.max(margin, Math.min(y, vh - height - margin));
      return { x: clampedX, y: clampedY };
    },
    [margin]
  );

  // Helper to clamp size and position inside viewport
  const clampSizeAndPos = useCallback(
    (w: number, h: number, x: number, y: number) => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

      const effMinWidth = Math.min(minWidth, Math.max(280, vw - margin * 2));
      const effMaxWidth = Math.min(maxWidth, Math.max(effMinWidth, vw - margin * 2));
      const effMinHeight = Math.min(minHeight, Math.max(350, vh - margin * 2));
      const effMaxHeight = Math.min(maxHeight, Math.max(effMinHeight, vh - margin * 2));

      const clampedW = Math.max(effMinWidth, Math.min(w, effMaxWidth));
      const clampedH = Math.max(effMinHeight, Math.min(h, effMaxHeight));

      const clampedX = Math.max(margin, Math.min(x, vw - clampedW - margin));
      const clampedY = Math.max(margin, Math.min(y, vh - clampedH - margin));

      return {
        width: Math.round(clampedW),
        height: Math.round(clampedH),
        x: Math.round(clampedX),
        y: Math.round(clampedY),
      };
    },
    [minWidth, maxWidth, minHeight, maxHeight, margin]
  );

  // Initial layout & viewport resize listener
  useEffect(() => {
    const handleViewportResize = () => {
      if (typeof window === 'undefined') return;
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // On mobile screen, adapt size automatically
      let targetW = winSize.width;
      let targetH = winSize.height;

      if (mobile) {
        targetW = Math.min(window.innerWidth - margin * 2, defaultWidth);
        targetH = Math.min(window.innerHeight - margin * 2, defaultHeight);
      }

      const clampedWin = clampSizeAndPos(targetW, targetH, winPos.x, winPos.y);
      setWinSize({ width: clampedWin.width, height: clampedWin.height });
      setWinPos({ x: clampedWin.x, y: clampedWin.y });

      // Clamp button position
      const clampedBtnX = Math.max(margin, Math.min(buttonPos.x, window.innerWidth - buttonSize - margin));
      const clampedBtnY = Math.max(margin, Math.min(buttonPos.y, window.innerHeight - buttonSize - margin));
      setButtonPos({ x: clampedBtnX, y: clampedBtnY });
    };

    if (!initializedRef.current && typeof window !== 'undefined') {
      initializedRef.current = true;
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      const initialW = mobile ? Math.min(window.innerWidth - margin * 2, defaultWidth) : defaultWidth;
      const initialH = mobile ? Math.min(window.innerHeight - margin * 2, defaultHeight) : defaultHeight;
      setWinSize({ width: initialW, height: initialH });

      const winP = calculatePresetPos(initialPreset, initialW, initialH);
      setWinPos(winP);

      const btnP = calculatePresetPos(initialPreset, buttonSize, buttonSize);
      setButtonPos(btnP);
    }

    window.addEventListener('resize', handleViewportResize);
    return () => window.removeEventListener('resize', handleViewportResize);
  }, [
    buttonPos,
    buttonSize,
    calculatePresetPos,
    clampSizeAndPos,
    defaultHeight,
    defaultWidth,
    initialPreset,
    margin,
    winPos,
    winSize,
  ]);

  // Set position preset manually
  const setPositionPreset = (newPreset: PositionPreset) => {
    setPreset(newPreset);
    const winP = calculatePresetPos(newPreset, winSize.width, winSize.height);
    setWinPos(winP);
    const btnP = calculatePresetPos(newPreset, buttonSize, buttonSize);
    setButtonPos(btnP);
  };

  // Button Pointer Drag Handler
  const handleButtonPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only main click
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...buttonPos };
    let dragThresholdPassed = false;
    btnWasDraggedRef.current = false;

    const targetEl = e.currentTarget as HTMLElement;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch (_) {}

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (!dragThresholdPassed && Math.hypot(deltaX, deltaY) > 5) {
        dragThresholdPassed = true;
        btnWasDraggedRef.current = true;
        setIsBtnDragging(true);
      }

      if (dragThresholdPassed) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const nextX = Math.max(margin, Math.min(initialPos.x + deltaX, vw - buttonSize - margin));
        const nextY = Math.max(margin, Math.min(initialPos.y + deltaY, vh - buttonSize - margin));
        setButtonPos({ x: nextX, y: nextY });
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        targetEl.releasePointerCapture(upEvent.pointerId);
      } catch (_) {}

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setTimeout(() => setIsBtnDragging(false), 50);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Window Header Pointer Drag Handler
  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // Don't drag if interactive elements like buttons were clicked
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('select')) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...winPos };
    let dragStarted = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (!dragStarted && Math.hypot(deltaX, deltaY) > 3) {
        dragStarted = true;
        setIsWinDragging(true);
      }

      if (dragStarted) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const nextX = Math.max(margin, Math.min(initialPos.x + deltaX, vw - winSize.width - margin));
        const nextY = Math.max(margin, Math.min(initialPos.y + deltaY, vh - winSize.height - margin));
        setWinPos({ x: nextX, y: nextY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setIsWinDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Window Edge/Corner Pointer Resize Handler
  const handleResizePointerDown = (direction: ResizeDirection, e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...winPos };
    const initialSize = { ...winSize };
    setIsResizing(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newW = initialSize.width;
      let newH = initialSize.height;
      let newX = initialPos.x;
      let newY = initialPos.y;

      // Handle horizontal sizing
      if (direction.includes('e')) {
        newW = initialSize.width + deltaX;
      } else if (direction.includes('w')) {
        newW = initialSize.width - deltaX;
        newX = initialPos.x + deltaX;
      }

      // Handle vertical sizing
      if (direction.includes('s')) {
        newH = initialSize.height + deltaY;
      } else if (direction.includes('n')) {
        newH = initialSize.height - deltaY;
        newY = initialPos.y + deltaY;
      }

      const clamped = clampSizeAndPos(newW, newH, newX, newY);
      setWinSize({ width: clamped.width, height: clamped.height });
      setWinPos({ x: clamped.x, y: clamped.y });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setIsResizing(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return {
    buttonPos,
    winPos,
    winSize,
    preset,
    isMobile,
    isBtnDragging,
    isWinDragging,
    isResizing,
    btnWasDraggedRef,
    setPositionPreset,
    handleButtonPointerDown,
    handleHeaderPointerDown,
    handleResizePointerDown,
  };
}
