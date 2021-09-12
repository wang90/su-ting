// components/checkout-pwd/index.js
import { PayForMoney } from '../../apis/index.js'; 
Component({
  properties: {
    orderid: {
      type:String,
      value: '',
    }
  },
  data:{
      tips: true,
  },
  methods: {
    choose() {
      if ( this.data.tips == false ) {
        return null;
      }
      wx.showLoading({
        title: '支付中',
      })
      this.setData({
        'tips': false
      })
      PayForMoney( this.data.orderid ).then( res=> {
        const { status, data } = res;
        wx.hideLoading();
        this.setData({
          'tips': true,
        })
        if ( status == 200 ) {
          const { appid, noncestr, partnerid, prepayid, sign, timestamp, } =data;
          const _data ={
            "timeStamp": timestamp,
            "nonceStr": noncestr,
            "package": `prepay_id=${ prepayid }`,
            "signType": "MD5",
            "paySign": sign,
            "success":(res) => {
              wx.showToast({
                title: '支付成功',
                icon: 'error',
                duration: 2000
              })
              wx.redirectTo({  
                url: `/pages/orderitem/index?_id=${ this.data.orderid }`
              })
            },
            "fail":function(res){
              wx.showToast({
                title: '微信支付失败',
                icon: 'error',
                duration: 2000
              })
            },
            "complete":function(res){}
          }
          wx.requestPayment(_data)
        } else {
          wx.showToast({
            title: '生成支付订单失败',
            icon: 'error',
            duration: 2000
          })
        }
      }).catch(() => {
        wx.hideLoading()
        this.setData({
          'tips': true,
        })
      })
    }
  }
})
