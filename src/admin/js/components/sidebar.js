class SidebarAdmin {
  constructor() {
    this.isShow = false;
    this.phxSidebar = document.querySelector(".phoenix-sidebar");
  }

  handleToggle(event) {
    if (this.isShow === false) {
      this.phxSidebar.classList.add("show");
      this.isShow = true;
    } else {
      this.phxSidebar.classList.remove("show");
      this.isShow = false;
    }

    event.preventDefault();
  }
}

export default SidebarAdmin;
