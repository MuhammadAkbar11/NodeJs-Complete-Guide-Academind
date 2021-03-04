class ModalAdmin {
  constructor(
    modal,
    configs = {
      title: "",
      text: "",
    }
  ) {
    this.modal = modal;
    this.configs = configs;
  }

  whenShow(cb) {
    const modal = this.modal;
    const title = this.configs.title;
    if (modal) {
      return modal.addEventListener("show.bs.modal", function (event) {
        const button = event.relatedTarget;
        const modaltitle = modal.querySelector(".modal-title");
        modaltitle.textContent = title;
        return cb(button, event);
      });
    }
  }
}

export default ModalAdmin;
