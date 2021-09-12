// components/customer-call/index.js
import { GetCutomerPhone } from '../../apis/index.js';
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    phone: '400-005-7711',
  },
  attached() {
    GetCutomerPhone().then(res=> {
      const { status, data } = res;
      if ( status == '200' ) {
        const { phone } = data;
        if ( phone ) {
          this.setData({ 'phone': phone })
        }
      }
    })
  },
  methods: {
    close() {
      this.setData({'show': false })
    },
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
        success(res){},
        fail(err) {}
      })
    },
  }
})
