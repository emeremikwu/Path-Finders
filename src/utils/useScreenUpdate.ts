import { useEffect, useState } from 'react';

/**
 * A hook that updates when the screen is resized or the zoom is changed
 * @returns an object with a count property that increases when the screen is resized
 */
function useScreenUpdate() {
  const [pixelRatio, setPixelRatio] = useState(window.devicePixelRatio);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // we could also set it to a count, the actual value doesn't matter
  const [screenUpdate, setScreenUpdate] = useState({ count: 0 });

  useEffect(() => {
    const handleResize = () => {
      setPixelRatio(window.devicePixelRatio);
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setScreenUpdate((prev) => ({ count: prev.count + 1 }));
  }, [pixelRatio, width, height]);

  return screenUpdate;
}

export default useScreenUpdate;
