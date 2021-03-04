import "./scss/main.client.scss";
import feather from "feather-icons"

import * as sidebar from "./js/components/sidebar";

feather.replace();

const toggleSidebar = [...document.querySelectorAll(".phx-toggle")];
toggleSidebar.map(btn => {
  btn.addEventListener("click", e => sidebar.handleToggle(e));
});

const btnLogout = [...document.querySelectorAll(".btn-logout")];
btnLogout.map(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    sidebar.handleLogout(e)
  });
});
