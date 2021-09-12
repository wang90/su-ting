// pages/messageQustion/index.js
import { BecomeLandlord } from '../../apis/index.js';
import { regPhone } from '../../utils/reg.js';

Page({
  data: {
    title: '',
    message: '',
    phone:'',
    address: '',
    persion: '',
    autosize: {'maxHeight': 238, 'minHeight': 238 },
    active: false,
  },
  sumit() {
    if ( this.data.active ) {
      const phone = this.data.phone;
      if ( !regPhone(phone)) {
        wx.showToast({
          title: '手机号错误',
          icon: 'error',
          duration: 2000
        });
        return null;
      }
      BecomeLandlord({
        title: this.data.title,
        address: this.data.address,
        phone: this.data.phone,
        persion: this.data.persion,
        value:this.data.message,
      }).then( res => {
        const { status, data } = res;
        if (status == 200 ) {
          wx.showToast({
            title: '请耐心等待',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack();
        }else {
          wx.showToast({
            title: '提交失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '信息未填写完全',
        icon: 'error',
        duration: 2000
      });
    }
  },
  onChangeVal($event) {
    const val = $event.detail;
    this.setData({'message': val, 'msg': true })
    this.checkButton();
  },
  onChangeTitle($event) {
    const title = $event.detail;
    this.setData({'title': title })
    this.checkButton();
  },
  onChangePhone($event) {
    const phone = $event.detail;
    this.setData({'phone': phone })
    this.checkButton();
  },
  onChangePersion($event) {
    const persion = $event.detail;
    this.setData({'persion': persion })
    this.checkButton();
  },
  onChangeAddress($event) {
    const address = $event.detail;
    this.setData({'address': address })
    this.checkButton();
  },
  checkButton() {
    const title = this.data.title;
    const messsage = this.data.message;
    const phone = this.data.phone;
    const persion = this.data.persion;
    const address = this.data.address;

    if ( title && phone && address && persion ) {
      this.setData({ 'active': true })
    }else {
      this.setData({ 'active': false })
    }
  }
})