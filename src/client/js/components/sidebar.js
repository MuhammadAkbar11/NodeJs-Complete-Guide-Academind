let statusClassShow = false;

const phxSidebar = document.querySelector(".phoenix-sidebar");

export const handleToggle = e => {
  if (statusClassShow == false) {
    phxSidebar.classList.add("show");
    statusClassShow = true;
  } else {
    phxSidebar.classList.remove("show");
    statusClassShow = false;
  }

  e.preventDefault();
};

const formLogout = document.querySelector("#form-logout");

export const handleLogout = e => {
  if (formLogout) {
    formLogout.submit();
  }
};
