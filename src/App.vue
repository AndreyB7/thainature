<template>
  <!-- eslint-disable -->
  <div id="app">
    <div v-if="products.length < 1">Загрузка...</div>
    <ul class="products">
      <li
        class="product"
        @mouseenter="product.hover = true"
        @mouseleave="product.hover = false"
        :class="product.hover ? 'active' : ''"
        v-for="(product, index) in products"
        v-bind:key="index"
      >
        <div class="card-wrap">
          <a class="link-img" :href="product.link">
            <img :src="product.img" />
          </a>
          <div class="card-content">
            <a :href="product.link">
              <h2 class="title">{{ product.title }}</h2>
            </a>
            <p class="desc">
              {{ product.excerpt }}
              <br />
              <a class="more" :href="product.link">Подробнее</a>
            </p>
            <div class="pack">{{ product.pack }}</div>
            <span class="price">
              {{ product.price }}
              <span class="currency">p.</span>
            </span>
          </div>
          <button
            @click="addCartItem(product.id)"
            :disabled="product.incart"
          >{{product.incart ? 'Выбрано' : 'Выбрать'}}</button>
        </div>
      </li>
    </ul>
    <Cart
      :cart="cart"
      :animate="animate"
      :Total="Total"
      :popupopen="popupopen"
      v-on:dell-item="dellCartItem"
      v-on:add-item="addCartItem"
      v-on:toggle-popup="togglePopup"
    />
    <ContactForm
      :cart="cart"
      :Total="Total"
      :popupopen="popupopen"
      v-on:toggle-popup="togglePopup"
    />
    <!-- <div class="debug"><pre>{{products[2]}}||{{cart[0]}}</pre></div> -->
  </div>
</template>

<script>
import ContactForm from "./components/ContactForm";
import Cart from "@/components/Cart";
import axios from "axios";

export default {
  name: "App",
  components: {
    ContactForm,
    Cart
  },
  data: () => {
    return {
      products: [],
      cart: [],
      animate: false,
      popupopen: false,
      isSuccess: false
    };
  },
  computed: {
    Total() {
      let total = {
        count: 0,
        summ: 0
      };
      this.cart.forEach(item => {
        total.count++;
        total.summ += item.price * item.qty;
      });
      return total;
    }
  },
  methods: {
    dellCartItem: function(cartindex, id) {
      var prindex = this.products.findIndex(product => product.id === id);
      if (this.cart[cartindex].qty > 1) {
        //if (this.products[prindex].qty > 1) {
        this.products[prindex].qty--;
      } else {
        this.cart.splice(cartindex, 1);
        this.products[prindex].qty = 0;
        this.products[prindex].incart = false;
      }
      localStorage.cart = JSON.stringify(this.cart);
    },
    addCartItem: function(id, qty) {
      //animate cart btn
      this.animate = true;
      setTimeout(() => (this.animate = false), 200);
      clearTimeout();
      //end
      let index = this.products.findIndex(product => product.id === id);
      let cartindex = this.cart.findIndex(cartitem => cartitem.id === id);
      if (this.products[index].incart) {
        //this.products[index].qty++;
        this.cart[cartindex].qty++;
      } else {
        this.cart.push(this.products[index]);
        this.products[index].incart = true;
        this.products[index].qty = 1;
      }
      if (qty > 1) {
        this.products[index].qty = qty;
      }
      localStorage.cart = JSON.stringify(this.cart);
    },
    fetchdata: function() {
      //fetch("https://thai-open.ru/json-api/")
      //  .then(response => response.json())
      //  .then(json => {
      //    this.products = json;
      //    this.updateCart();
      //  });

      axios
        .get("https://thai-open.ru/json-api/")
        .then(response => {
          this.products = response.data;
        })
        .catch(err => {
          console.log(err)
        });
    },
    updateCart: function() {
      if (localStorage.cart) {
        let savedcart = JSON.parse(localStorage.cart);
        savedcart.forEach(cartitem =>
          this.addCartItem(cartitem.id, cartitem.qty)
        );
      }
    },
    togglePopup: function() {
      this.popupopen = !this.popupopen;
    }
  },
  created() {
    this.fetchdata();
  }
};
</script>
<style>
#app {
  font-family: "Exo 2", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.products {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 15px -15px;
  padding: 0;
  min-height: 450px;
}
.product {
  margin: 15px;
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}
.card-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
}
.product.active {
  box-shadow: 0 0 10px #d4d4d4;
}
.product .title {
  font-size: 1.4rem;
  font-weight: bold;
}
.product .link-img {
  width: 300px;
  height: 192px;
  display: block;
  overflow: hidden;
}
.product img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.product .more {
  color: #007700;
}
.product .desc {
  flex: 1 1 0%;
}
.product .pack {
  color: #009fe0;
}
.product .card-content {
  padding: 0 10px 10px 10px;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  border: 1px solid #d4d4d4;
  border-top: 0;
  border-bottom: 0;
}
.product .price {
  font-size: 20px;
  font-weight: bold;
}
.product .currency {
  position: absolute;
  font-weight: normal;
  margin-left: 0.25rem;
}
.product button {
  border-radius: 0 0 10px 10px;
  text-transform: uppercase;
  outline: none;
}
.product button:disabled {
  background: #0077005e;
}
.product a {
  color: inherit;
  text-decoration: none;
}
.product a:hover {
  color: #009fe0;
}
</style>
<style>
button:disabled {
  background-color: #d4d4d4;
  cursor: unset;
  color: #777;
  border-color: #777;
}
.debug {
  border-radius: 4px;
  position: fixed;
  top: 0;
  left: 0;
  overflow: scroll;
  max-height: 100vh;
  margin: 50px auto;
  width: 500px;
  background-color: #000;
  padding: 50px;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
}

.debug pre {
  color: #ffffff;
  font-size: 18px;
  line-height: 30px;
  font-family: "Source Code Pro", monospace;
  font-weight: 300;
  white-space: pre-wrap;
}
</style>
