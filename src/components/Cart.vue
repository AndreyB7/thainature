<template>
  <!-- eslint-disable -->
  <div class="shopping-cart-fixed" :class="cartopen ? 'open' : 'close'">
    <div class="shopping-cart">
      <button :class="animate ? 'animate' : ''" class="cart-toggle" @click="cartopen = !cartopen">
        <svg width="24" height="24" viewBox="0 0 576 512">
          <path
            fill="currentColor"
            d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z"
          />
        </svg>
        {{cart.length}}
      </button>
      <h2 v-if="cart.length < 1" style="margin-bottom:5px;">Сделайте выбор</h2>
      <h2 v-else>Вами выбрано</h2>
      <div class="table-wrap">
        <table class="cart-table">
          <tr v-for="(cartitem, index) in cart" v-bind:key="index">
            <td>{{index+1}}</td>
            <td style="text-align:left">
              {{cartitem.title}}
              <br />
              <small>{{cartitem.pack}}</small>
            </td>
            <td>{{cartitem.price}}p.</td>
            <td>
              <button @click="$emit('add-item', cartitem.id)">&plus;</button>
              <div>{{cartitem.qty}}</div>
              <button @click="$emit('dell-item', index, cartitem.id)">&minus;</button>
            </td>
            <td style="min-width: 80px;">{{cartitem.qty*cartitem.price}}p.</td>
          </tr>
        </table>
      </div>
      <div class="check-out">
        <span v-if="cart.length > 0">
          <strong>Всего: {{ Total.summ }}p. </strong>
        </span>
        <button @click="$emit('toggle-popup')" :disabled="cart.length < 1">Оформить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart",
  props: ["cart", "Total", "animate", "popupopen"],
  data: () => {
    return {
      cartopen: false
    };
  }
};
</script>

<style scoped>
button {
  outline: none;
}
.shopping-cart-fixed {
  position: fixed;
  top: 100%;
  right: 0;
  z-index: 3;
  max-width: 100vw;
  transition: all 0.2s ease-in-out;
}
.shopping-cart-fixed.open {
  bottom: 0;
  top: auto;
}
.shopping-cart {
  background: #fff;
  border: 1px solid #d4d4d4;
  border-radius: 10px 0 0 0;
  width: 500px;
  max-width: 100vw;
  margin: auto;
  position: relative;
  padding: 0 10px;
}
.cart-table {
  width: 100%;
  margin: auto;
  padding: 0;
  border-collapse: collapse;
}
.shopping-cart h2 {
  margin-top: 50px;
}
.cart-toggle {
  position: absolute;
  right: 14px;
  top: -50px;
  background: #007700;
  color: #fff;
}
button.cart-toggle {
  transition: transform 0.15s ease-in-out;
}
.shopping-cart-fixed:not(.open) button.animate.cart-toggle {
  transform: scale(2);
}
.cart-toggle svg {
  display: block;
  height: 24px;
  float: left;
  margin-right: 10px;
}
.open .cart-toggle {
  top: 12px;
}
.cart-table td {
  min-width: 2rem;
}
.table-wrap {
  overflow: auto;
  max-height: 70vh;
}
.cart-table tr {
  height: 35px;
}
.cart-table td {
  border: none;
  border-bottom: 1px solid #e2e2e2;
  border-top: 1px solid #e2e2e2;
  padding: 5px 10px;
  vertical-align: middle;
}
td button {
  padding: 0 10px;
  line-height: 0px;
  height: 20px;
  border-radius: 4px;
}
.cart-table li {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
li {
  list-style: none;
}
.check-out {
  margin: 10px 0;
  text-align: right;
}
</style>
