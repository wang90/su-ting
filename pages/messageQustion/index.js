// pages/messageQustion/index.js
import { AddMessageApi } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    title: '',
    message: '',
    autosize: {'maxHeight': 238, 'minHeight': 238 },
    city: '选择城市',
    active: false,
    cityid: '',
    msg: false,
  },
  onShow() {
    this.getCity();
  },
  getCity() {
    const __city = app.getCity();
    const { city, cityid } = __city;
    if ( city ) {
      this.setData({
        city: city,
        cityid:  cityid,
      })
      this.checkButton();
    }
  },
  toCity() {
    wx.navigateTo({
      url: `/pages/citylist/index`
    })
  },
  sumit() {
    if ( this.data.active ) {

      AddMessageApi({
        title: this.data.title,
        cityid: this.data.cityid,
        value:this.data.message,
      }).then( res => {
        const { status } = res;
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
  onChangeTitle($event) {
    const title = $event.detail;
    this.setData({'title': title })
    this.checkButton();
  },
  checkButton() {
    const title = this.data.title;
    const messsage = this.data.message;
    const cityid = this.data.cityid;
    if ( title.length > 0 && title.length <= 20 && messsage && cityid ) {
      this.setData({'active': true })
    } else {
      this.setData({'acitve': false })
    }
  }
})