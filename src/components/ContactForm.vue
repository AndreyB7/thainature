<template>
  <!-- eslint-disable -->
  <div class="form-wrapper" :class="popupopen ? 'open' : 'close' ">
    <form class="vue-form" @submit.prevent="revalidate">
      <fieldset>
        <span class="close-form" @click="$emit('toggle-popup')">
        <svg width="20" height="20" fill="currentcolor"><use xlink:href="/symbol-defs.svg#icon-close"></use></svg>
        </span>
        <legend>ОТПРАВЬТЕ ЗАКАЗ</legend>
        <div>
          <label class="label" for="name">Ваше Имя</label>
          <input type="text" name="name" id="name" required v-model="name" />
        </div>
        <div>
          <label class="label" for="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            :class="{ email, error: !email.valid }"
            v-model="email.value"
            placeholder="email@google.com"
          />
          <div class="field-error" v-show="!email.valid">Проверьте введенные данные...</div>
        </div>
        <div>
          <label class="label" for="phone">Телефон c международным кодом</label>
          <input
            type="text"
            name="phone"
            id="phone"
            required
            :class="{ phone, error: !phone.valid }"
            v-model="phone.value"
            placeholder="+79771234567"
          />
          <div class="field-error" v-show="!phone.valid">Проверьте введенные данные...</div>
        </div>
        <div>
          <label
            class="label"
            for="textarea"
          >Укажите почтовый адрес доставки и необходимые пояснения к Вашему заказу:</label>
          <textarea
            class="message"
            name="textarea"
            id="textarea"
            required
            v-model="message.text"
            :maxlength="message.maxlength"
          ></textarea>
          <span class="counter">{{ message.text.length }} / {{ message.maxlength }}</span>
        </div>
        <div class="form-message">
            <div v-show="submitted">
              Ваш заказ отправлен.
              <br />Мы свяжемся с Вами в ближайшее время.
              <br />
              <a href="#" @click="closeAndClear">Закрыть</a>
            </div>
        </div>
        <div>
          <input type="submit" :value="buttontext" :disabled="isDisabled" />
          <vue-programmatic-invisible-google-recaptcha
            ref="invisibleRecaptcha1"
            :sitekey="'6Leb2csZAAAAAJ2MpSIqhxeVhcnRj1pqW6XQycYG'"
            :elementId="'invisibleRecaptcha1'"
            :badgePosition="'left'"
            :showBadgeMobile="false"
            :showBadgeDesktop="true"
            @recaptcha-callback="recaptchaCallback"
          ></vue-programmatic-invisible-google-recaptcha>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import VueProgrammaticInvisibleGoogleRecaptcha from "vue-programmatic-invisible-google-recaptcha";

// Regular expression from W3C HTML5.2 input specification:
// https://www.w3.org/TR/html/sec-forms.html#email-state-typeemail
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const phoneRegExp = /^[0-9\-+]{9,15}$/;

export default {
  name: "ContactForm",
  props: ["cart", "Total", "popupopen"],
  components: {
    VueProgrammaticInvisibleGoogleRecaptcha
  },
  data: function() {
    return {
      name: "",
      email: {
        value: "",
        valid: true
      },
      phone: {
        value: "",
        valid: true
      },
      message: {
        text: "",
        maxlength: 255
      },
      buttontext: "Отправить",
      submitted: false,
      isDisabled: true,
      recaptchaToken: 'nothing...',
      recaptchaStatus: ''
    };
  },
  methods: {
    // submit form handler
    revalidate: function() {
      this.$refs.invisibleRecaptcha1.execute();
      this.isDisabled = true;
      this.buttontext = "Отправка..."
    },
    recaptchaCallback(recaptchaToken) {
      var data = '&grecaptchaToken=' + recaptchaToken;
      axios.post("https://thai-open.ru/registercaptcha.php", data ).then(result => {
        this.recaptchaStatus = result.data.status;
        if (result.data.status === 'ok') {
          this.submit();
        } else {
          this.isDisabled = false;
          this.buttontext = "Ошибка"
        }
      });
      this.recaptchaToken = recaptchaToken
    },
    submit: function() {
      this.submitted = true;
      this.buttontext = "Отправлено";
      var cartoutput = () => {
        var output = [];
        this.cart.forEach(item => {
          output.push("" + item.title + " - " + item.qty + "шт");
        });
        return output;
      };
      var senddata =
        "name=" +
        this.name +
        "&email=" +
        this.email.value +
        "&phone=" +
        this.phone.value.replace(/[^0-9]/g,'') +
        "&message=" +
        this.message.text +
        "&cart=" +
        JSON.stringify(cartoutput()) +
        "";
      axios
        .post(
          "https://thai-open.ru/wp-admin/admin-ajax.php?action=send_mail_to",
          senddata,
          {
            headers: {
              Accept: "application/json"
            }
          }
        )
        .then(
          response => {
            console.log(response.data);
          },
        );
    },
    // validate by type and value
    validate: function(type, value) {
      if (this.submitted) return
      this.isDisabled = true;
      if (type === "email") {
        this.email.valid = this.isEmail(value) ? true : false;
      }
      if (type === "phone") {
        this.phone.valid = this.isPhone(value) ? true : false;
      }
      if (
        this.phone.valid &
        this.email.valid &
        (this.email.value.length > 3) &
        (this.phone.value.length > 5)
      ) {
        this.isDisabled = false;
      }
    },
    // check for valid email adress
    isEmail: function(value) {
      return emailRegExp.test(value);
    },
    isPhone: function(value) {
      return phoneRegExp.test(value);
    },
    closeAndClear: function() {
      this.$emit('toggle-popup')
      this.$emit('clear-cart')
      this.submitted = false;
      this.isDisabled = false;
      this.buttontext = "Отправить";
    }
  },
  mounted() {
    if (localStorage.formdata) {
      var StoredData = JSON.parse(localStorage.formdata);
      this.name = StoredData.name;
      this.validate("email", StoredData.email.value);
      this.validate("phone", StoredData.phone.value);
      this.email.valid ? (this.email.value = StoredData.email.value) : "";
      this.phone.valid ? (this.phone.value = StoredData.phone.value) : "";
    }
  },
  watch: {
    $data: {
      handler: function(data) {
        localStorage.formdata = JSON.stringify(data);
      },
      deep: true
    },
    email: {
      handler: function(email) {
        this.validate("email", email.value);
      },
      deep: true
    },
    phone: {
      handler: function(phone) {
        this.validate("phone", phone.value);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.vue-form div.field-error {
    color:#ff7777;
    margin: 0px;
    position: absolute;
    font-size: 12px;
    line-height: 12px;
    bottom: -15px;
}
.close-form {
  cursor: pointer;
}
.close-form {
  position: absolute;
  top: 10px;
  right: 10px;
}
*,
*::after,
*::before {
  box-sizing: border-box;
}
.form-wrapper.open {
  visibility: visible;
  opacity: 1;
  z-index: 4;
}
.form-wrapper {
  transition: all 0.2s ease-in-out;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  left: 0;
  overflow: auto;
  background: rgba(0,0,0,.5);
  display: flex;
}
body {
  color: #fff;
  background: #949c4e;
  background: linear-gradient(
    115deg,
    rgba(86, 216, 228, 1) 10%,
    rgba(159, 1, 234, 1) 90%
  );
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body,
.container {
  min-height: 100vh;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  color: #007700;
  text-decoration: none;
}

header {
  position: relative;
  height: 150px;
  padding-top: 100px;
}

header h1 {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 300;
}

#app {
  display: flex;
}

.vue-form {
  font-size: 16px;
  width: 500px;
  padding: 15px;
  border-radius: 10px;
  margin: auto;
  width: 500px;
  max-width: 100vw;
  background-color: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
  position: relative;
}
.vue-form fieldset {
  margin: 0;
  border: none;
  outline: none;
}
.vue-form legend {
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
  font-size: 25px;
  font-weight: bold;
}
.vue-form div {
  position: relative;
  margin: 20px 0;
}
.vue-form h4,
.vue-form .label {
  color: #94aab0;
  margin-bottom: 10px;
}
.vue-form .label {
  display: block;
}
.vue-form input,
.vue-form textarea,
.vue-form select,
.vue-form label {
  color: #007700;
}
.vue-form input[type="text"],
.vue-form input[type="email"],
.vue-form textarea,
.vue-form select,
.vue-form legend {
  display: block;
  width: 100%;
  appearance: none;
}
.vue-form input[type="text"],
.vue-form input[type="email"],
.vue-form textarea,
.vue-form select {
  padding: 12px;
  border: 1px solid #cfd9db;
  background-color: #ffffff;
  border-radius: 0.25em;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}
.vue-form input[type="text"]:focus,
.vue-form input[type="email"]:focus,
.vue-form textarea:focus,
.vue-form select:focus {
  outline: none;
  border-color: #007700;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.2);
}
.vue-form .select {
  position: relative;
}
.vue-form .select::after {
  content: "";
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 50%;
  margin-top: -8px;
  display: block;
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Cg%3E%0D%0A%09%3Cpolygon%20fill%3D%22%23007700%22%20points%3D%220.9%2C5.5%203.1%2C3.4%208%2C8.3%2012.9%2C3.4%2015.1%2C5.5%208%2C12.6%20%09%22%2F%3E%0D%0A%3C%2Fg%3E%0D%0A%3C%2Fsvg%3E")
    no-repeat center center;
  pointer-events: none;
}
.vue-form select {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.vue-form select::-ms-expand {
  display: none;
}
.vue-form .vue-form-list {
  margin-top: 16px;
}
.vue-form .vue-form-list::after {
  clear: both;
  content: "";
  display: table;
}
.vue-form .vue-form-list li {
  display: inline-block;
  position: relative;
  user-select: none;
  margin: 0 26px 16px 0;
  float: left;
}
.vue-form input[type="radio"],
.vue-form input[type="checkbox"] {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
  opacity: 0;
  z-index: 2;
}
.vue-form input[type="radio"] + label,
.vue-form input[type="checkbox"] + label {
  padding-left: 24px;
}
.vue-form input[type="radio"] + label::before,
.vue-form input[type="radio"] + label::after,
.vue-form input[type="checkbox"] + label::before,
.vue-form input[type="checkbox"] + label::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -8px;
  width: 16px;
  height: 16px;
}
.vue-form input[type="radio"] + label::before,
.vue-form input[type="checkbox"] + label::before {
  border: 1px solid #cfd9db;
  background: #ffffff;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}
.vue-form input[type="radio"] + label::before,
.vue-form input[type="radio"] + label::after {
  border-radius: 50%;
}
.vue-form input[type="checkbox"] + label::before,
.vue-form input[type="checkbox"] + label::after {
  border-radius: 0.25em;
}
.vue-form input[type="radio"] + label::after,
.vue-form input[type="checkbox"] + label::after {
  background-color: #007700;
  background-position: center center;
  background-repeat: no-repeat;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.4);
  display: none;
}
.vue-form input[type="radio"] + label::after {
  background-image: url("data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Ccircle%20fill%3D%22%23FFFFFF%22%20cx%3D%228%22%20cy%3D%228%22%20r%3D%223%22%2F%3E%0D%0A%3C%2Fsvg%3E");
}
.vue-form input[type="checkbox"] + label::after {
  background-image: url("data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2018.1.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Cpolyline%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-miterlimit%3D%2210%22%20points%3D%225%2C8%207%2C10%2011%2C6%20%22%2F%3E%0D%0A%3C%2Fsvg%3E");
}
.vue-form input[type="radio"]:focus + label::before,
.vue-form input[type="checkbox"]:focus + label::before {
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.6);
}
.vue-form input[type="radio"]:checked + label::after,
.vue-form input[type="checkbox"]:checked + label::after {
  display: block;
}
.vue-form input[type="radio"]:checked + label::before,
.vue-form input[type="radio"]:checked + label::after,
.vue-form input[type="checkbox"]:checked + label::before,
.vue-form input[type="checkbox"]:checked + label::after {
  animation: cd-bounce 0.3s;
}
.vue-form textarea {
  min-height: 120px;
  resize: vertical;
  overflow: auto;
}
.vue-form input[type="submit"] {
  border: none;
  text-transform: uppercase;
  background: #007700;
  border-radius: 10px;
  padding: 12px 20px;
  color: #ffffff;
  font-weight: bold;
  float: right;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  appearance: none;
}
.vue-form input[type="submit"]:disabled {
  background-color: #777;
  cursor: unset;
}
.no-touch .vue-form input[type="submit"]:hover {
  background: #42a2e1;
}
.vue-form input[type="submit"]:focus {
  outline: none;
  background: #007700;
}
.vue-form input[type="submit"]:active {
  transform: scale(0.9);
}
.vue-form .form-message > div {
  border: 1px solid #007700;
  margin: 25px 0 0px;
  border-radius: 4px;
  padding: 5px;
}

.vue-form .error {
  border-color: #e94b35 !important;
}
.vue-form .counter {
  background-color: #ecf0f1;
  position: absolute;
  bottom: -19px;
  font-size: 10px;
  padding: 0px 3px;
  left: 0;
  border-radius: 3px;
}

@-webkit-keyframes cd-bounce {
  0%,
  100% {
    -webkit-transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.8);
  }
}
@-moz-keyframes cd-bounce {
  0%,
  100% {
    -moz-transform: scale(1);
  }
  50% {
    -moz-transform: scale(0.8);
  }
}
@keyframes cd-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
}
</style>
