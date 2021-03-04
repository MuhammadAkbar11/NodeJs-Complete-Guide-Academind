import { Toast } from "bootstrap";

class FeedbackToast {
  constructor(toastElList) {
    this.toastElList = toastElList;
    this.toastList = [];
  }

  showToast() {
    console.log(this.toastElList);
    const resultInit = this.toastElList.map(toast => {
      return new Toast(toast, {
        show: true,
        animation: true,
        autohide: true,
        delay: 6000,
      });
    });
    // prettier-ignore
    return resultInit.forEach(toast => toast.show());
  }
}

export default FeedbackToast;
