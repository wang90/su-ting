// components/to-payfor-button/index.js
const app = getApp();
Component({
  properties: {
    bookInfo: {
      type: Boolean,
      value: false,
    },
    money: {
      type: String,
      value: '',
    },
    special: {
      type:String,
      value:'',
    },
    houseid: {
      type:String,
      value:'',
    },
    oldmoney: {
      type: String,
      value: '',
    }
  },
  data: {
    showCall: false,
  },
  methods: {
    chooseCall() {
      this.setData({'showCall': true })
    },
    toOrder() {
      const houseid = this.data.houseid;
      if ( app.isLogin() ) {
        const __dates = app.getTimer();
        if ( __dates ) {
          wx.redirectTo({
            url: `/pages/order/index?_id=${ houseid }`
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有添加日期',
            confirmText: '去添加',
            showCancel: false,
            success (res) {
              if ( res.confirm ) {
                wx.navigateTo({
                  url: `/pages/datepage/index?houseid=${ houseid }&topage=order`
                })
              }
            }
          })    
        }
      }
    },
    toPageOrder() {
      wx.switchTab({
        url: `/pages/orderlist/index`
      })
    }
  }
})
