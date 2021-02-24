let statusClassShow = false;

const phxSidebar = document.querySelector(".phoenix-sidebar");

export const TrigerSidebarAdmin = e => {
  console.log(e);

  if (statusClassShow == false) {
    phxSidebar.classList.add("show");
    statusClassShow = true;
  } else {
    phxSidebar.classList.remove("show");
    statusClassShow = false;
  }

  e.preventDefault();
};
