<template>
  <div class="hello">
    <h3>{{ title }}</h3>
    <p>{{ texts }}</p>
    <button type="button" @click="LoadData">{{ buy.title }}</button>
    <div class="buttons-wrap">
      <button type="button" class="minus" @click="minusOne"></button>
      {{ buy.count }} ед.
      <button type="button" class="plus" @click="plusOne"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["title", "texts"],
  data() {
    return {
      buy: {
        title: "В КОРЗИНУ",
        count: 1
      }
    };
  },
  mounted() {
    if (localStorage.buy) {
      this.buy = JSON.parse(localStorage.buy);
    }
  },
  methods: {
    plusOne: function() {
      this.buy.count++;
    },
    minusOne: function() {
      if (this.buy.count > 0) {
        this.buy.count--;
      }
    },
    LoadData: function() {
      if (this.buy.title === "ОФОРМИТЬ") {
        this.buy.title = "ОТПРАВКА...";
        fetch(
          "https://api.telegram.org/bot1391995122:AAE7G9DRDozp-VduV0IdjkmM1jERFOV1nKU/sendMessage?chat_id=-431711252&parse_mode=html&text=заказ на " +
            this.buy.count +
            " ед."
        )
          .then(response => response.json())
          .then(json => {
            console.log("ответ: " + JSON.stringify(json));
            setTimeout(() => (this.buy.title = "ГОТОВО!"), 1000);
            setTimeout(() => (this.buy.title = "В КОРЗИНУ"), 3000);
          });
      }
      switch (this.buy.title) {
        case "В КОРЗИНУ":
          this.buy.title = "ОФОРМИТЬ";
          break;
        default:
          break;
      }
    }
  },
  watch: {
    buy: {
      handler: function(buy, newBuy) {
        localStorage.buy = JSON.stringify(newBuy);
      },
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
