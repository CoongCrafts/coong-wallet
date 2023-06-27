import { useMeasure } from 'react-use';

export default function useQrCodeSize() {
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  // Make sure the container is visible (width > 0) before calculating the QR code size
  let size = width;
  if (width !== 0) {
    size = width > 300 ? 250 : width - 20;
  }

  return { containerRef, size };
}
