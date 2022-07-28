let app = Vue.createApp({
  data() {
    return {
      inventory: [],
      cart: {},
      sidebarVisible: false,
    };
  },
  methods: {
    addToCart(name, quantity, price, key) {
      if (this.cart[name] === undefined) {
        this.cart[name] = { name, quantity, price };
      } else {
        this.cart[name].quantity += quantity;
      }
      this.inventory[key].quantity = 1;
    },
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
  },
  async mounted() {
    const res = await fetch("./food.json");
    const data = await res.json();
    this.inventory = data;
  },
  computed: {
    products() {
      this.inventory.forEach((element) => {
        element.quantity = 1;
      });
      return this.inventory;
    },
    cartTotalQuantity() {
      return Object.values(this.cart).reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
    },
  },
});
app.component("sidebar", {
  props: ["toggle_sidebar", "cart", "inventory"],
  template: `
    <aside class="cart-container">
      <div class="cart">
        <h1 class="cart-title spread">
          <span>
            Cart
            <i class="icofont-cart-alt icofont-1x"></i>
          </span>
          <button class="cart-close" @click="toggle_sidebar">&times;</button>
        </h1>

        <div class="cart-body">
          <table class="cart-table">
            <thead>
              <tr>
                <th><span class="sr-only">Product Image</span></th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart">
                <td><i class="icofont-carrot icofont-3x"></i></td>
                <td>{{item.name}}</td>
                <td>\${{item.price}}</td>
                <td class="center">{{item.quantity}}</td>
                <td>\${{ (item.price * item.quantity).toFixed(2) }}</td>
                <td class="center">
                  <button class="btn btn-light cart-remove" @click="removeItem(item.name)">
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="center"><em v-if="!Object.keys(cart).length">No items in cart</em></p>
          <div class="spread">
            <span><strong>Total:</strong> \${{ getCartValue() }}</span>
            <button class="btn btn-light">Checkout</button>
          </div>
        </div>
      </div>
    </aside>`,
  methods: {
    getCartValue() {
      let res = Object.values(this.cart).reduce((acc, item) => {
        console.log(acc, item.quantity, item.price);
        return acc + item.quantity * item.price;
      }, 0);
      return res.toFixed(2);
    },
    removeItem(name) {
      console.log(name);
      delete this.cart[name];
    },
  },
});
app.mount("#app");
