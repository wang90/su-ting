// pages/messageQustion/index.js
import { AddFeedApi } from '../../apis/index.js';

Page({
  data: {
    message: '',
    phone:'',
    autosize: {'maxHeight': 238, 'minHeight': 238 },
    active: false,
  },
  sumit() {
    if ( this.data.active ) {
      AddFeedApi({
        phone: this.data.phone,
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
    }
  },
  onChangeVal($event) {
    const val = $event.detail;
    this.setData({'message': val, 'msg': true })
    this.checkButton();
  },
  onChangePhone($event) {
    const phone = $event.detail;
    this.setData({'phone': phone })
    this.checkButton();
  },
  checkButton() {
    const phone = this.data.phone;
    const message = this.data.message;
    if ( phone && message ) {
      this.setData({ 'active': true })
    }else {
      this.setData({ 'active': false })
    }
  }
})