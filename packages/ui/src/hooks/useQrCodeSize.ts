import { useMeasure } from 'react-use';

export default function useQrCodeSize() {
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  // When componentWillMount width start at 0 and be updated later when componentDidMount
  // Return 0 to avoid the size get the value -20, which would result QR size unpredictable
  const size = width === 0 ? 0 : width > 300 ? 250 : width - 20;

  return { containerRef, size };
}
