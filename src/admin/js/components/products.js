class Product {
  constructor(form) {
    this.form = form;
  }
  deleteProduct() {
    return this.form.submit();
  }
}

export default Product;
