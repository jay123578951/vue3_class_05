import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jay0303597';

const app = Vue.createApp({
  data() {
    return {
      productModal: '',
      products: '',
      product: '',
      cart: '',
      loadingStatus: {
        loadingItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '' 
        },
        message: ''
      }
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      const api = `${apiUrl}/api/${apiPath}/products`;
      axios.get(api)
        .then((res) => {
          if(res.data.success) {
            this.products = res.data.products;
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(api)
        .then((res) => {
          if(res.data.success) {
            this.product = res.data.product;
            this.loadingStatus.loadingItem = '';
            this.$refs.userProductModal.openModal();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    addCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      const api = `${apiUrl}/api/${apiPath}/cart`;
      const cart = {
        product_id: id,
        qty
      }
      axios.post(api ,{data: cart})
        .then((res) => {
          if(res.data.success) {
            alert('成功加入到購物車');
            this.loadingStatus.loadingItem = '';
            this.getCart();
            this.$refs.userProductModal.hideModal();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getCart() {
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(api)
        .then((res) => {
          if(res.data.success) {
            this.cart = res.data.data;
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      }
      axios.put(api, {data: cart})
        .then((res) => {
          if(res.data.success) {
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    removeCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios.delete(api)
        .then((res) => {
          if(res.data.success) {
            alert('成功刪除購物車資料');
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    removeAllCarts() {
      const api = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(api)
        .then((res) => {
          if(res.data.success) {
            alert('成功刪除購物車資料');
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    onSubmit() {
      const api = `${apiUrl}/api/${apiPath}/order`;
      const user = this.form;
      axios.post(api, {data: user})
      .then((res) => {
        if(res.data.success) {
          alert('成功送出訂單');
          this.$refs.form.resetForm();
          this.getCart();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  },
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('userProductModal', productModal);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');
