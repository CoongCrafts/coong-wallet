export const topWindow = (): Window => {
  return window.top!;
};

// Ref: https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
export const isInsideIframe = () => {
  try {
    return window.self !== topWindow();
  } catch (e) {
    return true;
  }
};

export const openerWindow = (): Window => {
  return window.opener!;
};

export const isChildTabOrPopup = () => {
  return !!openerWindow();
};
