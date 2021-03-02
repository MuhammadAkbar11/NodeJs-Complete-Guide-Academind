import { TrigerSidebarAdmin } from "./js/components/sidebar.admin";

import "./scss/main.scss";

feather.replace();

const btnToggleSidebar = [...document.querySelectorAll(".phx-toggle")];
btnToggleSidebar.map(btn => {
  btn.addEventListener("click", e => TrigerSidebarAdmin(e));
});

const btnLogout = document.querySelector(".btn-logout");
const formLogout = document.querySelector("#form-logout");

btnLogout?.addEventListener("click", function (e) {
  e.preventDefault();
  formLogout.submit();
});
