<template>
  <!-- eslint-disable -->
  <div class="shopping-cart-fixed" :class="cartopen ? 'open' : 'close'">
    <div class="shopping-cart">
      <button :class="animate ? 'animate' : ''" class="cart-toggle" @click="cartopen = !cartopen">
        <svg width="24" height="24" fill="currentcolor">
          <use xlink:href="/symbol-defs.svg#icon-cart" />
        </svg>
        {{cart.length}}
      </button>
      <h2 v-if="cart.length < 1" style="margin-bottom:5px;">Сделайте выбор</h2>
      <h2 v-else>Вами выбрано</h2>
      <div class="table-wrap">
        <table class="cart-table">
            <tr v-for="(cartitem, index) in cart" v-bind:key="index">
              <td style="padding:0;">{{index+1}}</td>
              <td style="text-align:left">
                {{cartitem.title}}
                <br />
                <small>{{cartitem.pack}}</small>
              </td>
              <td style="width: 55px;">{{cartitem.price}}p.</td>
              <td>
                <button @click="$emit('add-item', cartitem.id)">&plus;</button>
                <div>{{cartitem.qty}}</div>
                <button :class="{'red':(cartitem.qty === 1)}" @click="$emit('dell-item', cartitem.id)">{{cartitem.qty > 1 ? '&minus;' : '&times;'}}</button>
              </td>
              <td style="width: 55px;">{{cartitem.qty*cartitem.price}}p.</td>
            </tr>
        </table>
      </div>
      <div class="check-out">
        <span v-if="cart.length > 0" style="font-size:20px;margin-right:10px">
          <strong>Всего: {{ Total.summ }}p.</strong>
        </span>
        <button @click="$emit('toggle-popup')" :disabled="cart.length < 1">ОФОРМИТЬ</button>
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
      cartopen: false,
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
button {
  outline: none;
  padding: 5px 15px;
}
button.red {
  background:#ffbdbd;
  border-color:#ffbdbd;
  color:#fff;
}
.shopping-cart-fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 3;
  max-width: 100vw;
  transition: all 0.2s ease-in-out;
  max-height: 0;
}
.shopping-cart-fixed.open {
  max-height: 100%;
}
.shopping-cart {
  background: #fff;
  border: 1px solid #f1f1f1;
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
  transition: top 0.2s, scale 0.5s;
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
  padding: 5px;
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
