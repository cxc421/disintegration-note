import { useState, useEffect, useRef } from 'react';

export function useLazyImage({ imgSmall, imgBig }) {
  const [src, setSrc] = useState(imgSmall);

  useEffect(() => {
    const img = new Image();
    img.onload = function() {
      setSrc(imgBig);
    };
    img.src = imgBig;
  }, [imgBig]);

  return src;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
