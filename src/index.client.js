import { TrigerSidebarAdmin } from "./js/components/sidebar.admin";
import { formatRupiah } from "./js/format.rupiah";
import "./scss/main.scss";

const stringPrice = [...document.querySelectorAll(".phx-rupiah")];

stringPrice.map(value => {
  const nilai = value.textContent.trim();
  const nilaiKonfersi = formatRupiah(nilai, "Rp. ");
  value.innerHTML = nilaiKonfersi;
});

feather.replace();

const btnToggleSidebar = [...document.querySelectorAll(".phx-toggle")];
btnToggleSidebar.map(btn => {
  btn.addEventListener("click", e => TrigerSidebarAdmin(e));
});
