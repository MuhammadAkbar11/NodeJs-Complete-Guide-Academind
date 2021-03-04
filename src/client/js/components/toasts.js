import { Toast } from "bootstrap";

export const ShowToast = toasts => {
  return toasts.map(function (toast) {
    return new Toast(toast, {
      show: true,
      animation: true,
      autohide: true,
      delay: 7000,
    });
  });
};
