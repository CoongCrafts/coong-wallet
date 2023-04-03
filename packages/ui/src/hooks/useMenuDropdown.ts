import { useMemo, useState } from 'react';

export default function useMenuDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const doClose = () => {
    setAnchorEl(null);
  };

  const doOpen = (elementToAttach: HTMLElement) => {
    setAnchorEl(elementToAttach);
  };

  return {
    open,
    anchorEl,
    doOpen,
    doClose,
  };
}
