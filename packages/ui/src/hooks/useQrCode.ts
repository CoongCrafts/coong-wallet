import { useMeasure } from 'react-use';

export default function useQrCode() {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const size = width > 300 ? 250 : width - 64;

  return { ref, size };
}
