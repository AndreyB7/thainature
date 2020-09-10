<template>
  <div>
    <h2>Вами выбрано:</h2>
    <p v-if="cart.length < 1">Пока ничего не выбрано...</p>
    <table class="cart">
    <tr v-for="(cartitem, index) in cart" v-bind:key="index">
        <td>{{index+1}}</td>
        <td>{{cartitem.title}}</td>
        <td>{{cartitem.price}}p.</td>
        <td><button @click="$emit('add-item', cartitem.id)">&plus;</button></td>
        <td>{{cartitem.qty}}</td>
        <td><button @click="$emit('dell-item', index, cartitem.id)">&minus;</button></td>
        <td>{{cartitem.qty*cartitem.price}}p.</td>
    </tr>
    <tr v-if="cart.length > 0"><td></td><td><strong>Всего:</strong></td><td></td><td></td><td></td><td></td><td><strong>{{ Total }}p.</strong></td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Cart",
  props: ['cart', 'Total']
};
</script>

<style scoped>
button {
  outline: none;
}
.cart {
  width: fit-content;
  margin: auto;
  padding: 0;
  border-collapse: collapse;

}
.cart tr {
  height: 35px;
}
.cart td {
  border-bottom: 1px solid #e2e2e2;
  border-top: 1px solid #e2e2e2;
}
.cart li {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

}
li {
    list-style: none;
}
</style>