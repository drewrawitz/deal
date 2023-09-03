import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    // const sme = new Expert();
    // sme.email = "email@drewrawitz.com";
    // sme.first_name = "Drew";
    // sme.last_name = "Rawitz";
    // user.email = "email@drewrawitz.com";
    // await AppDataSource.manager.save(sme);
    // console.log("Saved a new user with id: " + user.id);
    // console.log("Inserting a new product into the database...");
    // const product = new Product();
    // product.name = "411 Athletic Taper";
    // product.max_order_qty = 4;
    // await AppDataSource.manager.save(product);
    // console.log("Saved a new product with id: " + product.id);
    // console.log("Inserting a new cart into the database...");
    // const cart = new CartItem();
    // cart.product_id = "prod_01H5QWSRX45374S5H9WJMTZDZX";
    // cart.cart_id = "cart_01H5R4BXPCNHR5GCR4BJ5311R6";
    // cart.quantity = 1;
    // await AppDataSource.manager.save(cart);
  })
  .catch((error) => console.log(error));
