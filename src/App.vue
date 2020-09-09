<template>
  <div id="app">
    <!-- <HelloWorld texts="Тестовая кнопка покупки" title="Корзина" /> -->
    <ul :class="'products'">
      <li
        @mouseenter="product.hover = true"
        @mouseleave="product.hover = false"
        :class="product.hover ? 'active' : ''"
        v-for="product in products"
        v-bind:key="product.id"
      >
        <img v-if="product.img" :src="product.img" />
        <div class="card-content">
        <a :href="product.link"><h2>{{ product.post_title }}</h2></a>
        <p>{{ product.excerpt }}</p>
        <p class="pack">{{ product.pack }}</p>
        <p class="price">{{ product.price }}<span class="currency"> p.</span></p>
        </div>
        <p><button :class="product.incart ? 'btn-incart' : 'btn-order'" @click="product.incart = !product.incart; saveCart(product.id, this.cart)">{{product.incart ? 'В Заказе' : 'Заказать'}}</button></p>
      </li>
    </ul>
    <ContactForm />
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld";
import ContactForm from "./components/ContactForm";

export default {
  name: "App",
  components: {
    //HelloWorld,
    ContactForm
  },
  data() {
    return {
      products: [],
      cart: []
    };
  },
  methods: {
    saveCart: (id, cart) => {
      if (cart.indexOf(id) === -1) {cart.push(id)};
      localStorage.cart = JSON.stringify(cart);
    },
    fetchdata: function() {
      //fetch(`https://jsonplaceholder.typicode.com/users`)
      fetch("https://thai-open.ru/json-api/")
        .then(response => response.json())
        .then(json => {
          this.products = json;
        });
    }
  },
  mounted() {
    this.fetchdata();
    if (localStorage.cart) {
      this.cart = JSON.parse(localStorage.cart);
    }
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
}
.products li {
  margin: 15px;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.products li.active {
  box-shadow: 0 0 10px #d4d4d4;
}
.products img {
  width: 300px;
  height: 192px;
  object-fit: cover;
}
.products .pack {
  color:#009FE0;
}
.products .card-content {
  padding: 0 10px 10px 10px;
}
.products .card-content p {
  margin-bottom: 0;
}
.products .price {
  font-size: 20px;
  font-weight: bold;
}
.products .currency {
  position: absolute;
  font-weight: normal;
  margin-left: 0.25rem;
}
.products button {
  text-transform: uppercase;
  outline: none;
}
.products a {
  color: inherit;
  text-decoration: none;
}
.products a:hover {
  color:#009FE0;
}
</style>
