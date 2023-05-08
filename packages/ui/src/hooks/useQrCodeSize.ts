import { useMeasure } from 'react-use';

export default function useQrCodeSize() {
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const size = width > 300 ? 250 : width - 64;

  return { containerRef, size };
}
