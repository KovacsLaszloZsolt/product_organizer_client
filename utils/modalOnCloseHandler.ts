export const modalOnCloseHandler = (_e: Event, reason: string, onClose: VoidFunction): void => {
  if (reason === 'backdropClick') {
    return;
  }
  onClose();
};
