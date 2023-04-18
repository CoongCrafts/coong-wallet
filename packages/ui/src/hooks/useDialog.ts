import { useState } from 'react';

export default function useDialog() {
  const [open, setOpen] = useState(false);

  const doClose = (afterClose?: () => void) => {
    setOpen(false);

    // Make sure the hiding transition is completed done before executing the `afterClose`
    afterClose && setTimeout(() => afterClose(), 100);
  };

  const doOpen = () => {
    setOpen(true);
  };

  return {
    open,
    doOpen,
    doClose,
  };
}
