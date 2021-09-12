// components/checkout-pwd/index.js
import { GetCheckOutPwd } from '../../apis/index.js';
Component({
  properties: {
    orderid: {
      type:String,
      value: '',
    }
  },
  data: {
    show: false,
    pwd: '',
    title: '获取密码中...',
  },
  methods: {
    choose() {
      if ( !this.data.orderid ) {
        wx.showToast({
          title: '订单id未找到',
          icon: 'error',
          duration: 2000
        })
        return null;
      }
      GetCheckOutPwd( this.data.orderid ).then( res=> {
        const { status, data } = res;
        if ( status == 200 ) {
          const { pwdLockArray = [] }  = data;
          if ( pwdLockArray.length > 0 ) {
            const { keyboardPwd, lockContent } = pwdLockArray[0];
            if ( keyboardPwd ) {
              this.setData({
                'pwd': keyboardPwd, 
                'title': lockContent,
                "show": true 
              })
            } else {
              wx.showToast({
                title: '获取失败',
                icon: 'error',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '获取失败',
              icon: 'error',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    },
    onCloseCall() {
      this.close();
    },
    close() {
      this.setData({'show': false})
    }
  }
})
