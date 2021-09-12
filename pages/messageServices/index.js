// pages/messageServices/index.js
import { GetQusetionService, SendService } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    msgId: '',
    list: [],
    value: '',
  },
  onLoad: function (options) {
    const msgId = options._id;
    if ( msgId ) {
      this.setData({
        'msgId': msgId
      })
      this.getList();
    } else {
      wx.showToast({
        title: '无法反馈',
        icon: 'error',
        duration: 2000
      })
    }
  },
  getList() {
    GetQusetionService( this.data.msgId ).then( res=> {
      const { status, data } = res;
      if ( status == 200 ) {

        const { replyArray = [], title } = data;
        if ( replyArray.length > 0 ) {
          this.setData({
            list: replyArray,
          })
        }
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    })
  },
  chooseQusetion() {
    wx.navigateTo({
      url: `/pages/messageQustionHistory/index?_id=${ this.data.msgId }`
    })
  },
  onChange(event) {
    // event.detail 为当前输入的值
    const value = event.detail;
    this.setData({
      value: value,
    })
  },
  send() {
    const __value = this.data.value;
    if ( this.data.value) {
      SendService( this.data.msgId, __value ).then( res => {
        const { status, data } = res;
        if ( status == 200 ) {
          const __list = this.data.list;
          const avatarUrl = app.getUserInfo('avatarUrl');
          __list.push({
            content: __value,
            type: 2,
            userPhoto: avatarUrl,
          })
          this.setData({
            value: '',
            list: __list,
          })
        } else {
          wx.showToast({
            title: '发送失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    }
  }
})