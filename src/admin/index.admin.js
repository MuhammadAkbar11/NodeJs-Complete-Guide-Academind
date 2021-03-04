import "./scss/main.admin.scss";
import SidebarAdmin from "./js/components/sidebar";
import FeedbackToast from "./js/components/toasts";
import feather from "feather-icons";
import Product from "./js/components/products";
import ModalAdmin from "./js/components/modal";

const sidebar = new SidebarAdmin();
const product = new Product();

feather.replace();

const toggleSidebar = [...document.querySelectorAll(".phx-toggle")];
toggleSidebar.map(btn => {
  btn.addEventListener("click", e => sidebar.handleToggle(e));
});

const toastElList = [...document.querySelectorAll(".toast-flash")];

if (toastElList.length > 0) {
  new FeedbackToast(toastElList).showToast();
}

const modal = document.getElementById("modalConfirmDelete");

if (modal) {
  new ModalAdmin(modal, {
    title: "Are you sure ??",
  }).whenShow((button, modalEvent) => {
    const dataId = button.getAttribute("data-id");
    const btnDelete = modalEvent.target.querySelector(".btn-delete");
    const inputProdId = modalEvent.target.querySelector("#product-id");
    const formDelete = modalEvent.target.querySelector("#form-delete");
    inputProdId.value = dataId.trim();
    btnDelete.addEventListener("click", e => {
      const deleteProduct = new Product(formDelete);
      deleteProduct.deleteProduct();
    });
  });
}
