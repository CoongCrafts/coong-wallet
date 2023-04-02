import { useMemo, useState } from 'react';

export default function useAnchorEl() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  return [anchorEl, setAnchorEl, open] as const;
}
