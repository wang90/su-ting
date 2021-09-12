// pages/phone_login/index.js
import { SmsPhone, PhoneLoginApi } from '../../apis/index';
const app = getApp();
let timer = null;
let count = 60;
const SMS_DEFAULT = '发送验证码'
Page({
  data: {
    phone: '',
    code: '',
    sms_value: SMS_DEFAULT,
    sms_type: false,
  },
  onLoad( option ) {
    const { phone } = option;
    if ( phone ) {
      this.setData({'phone': phone })
    }
  },
  onPhoneChange( $event ) {
    this.setData({
      'phone': $event.detail,
    })
  },
  onSmsChange( $event ) {
    this.setData({
      'code': $event.detail,
    })
  },
  sms() {
    const __phone = this.data.phone;
    if ( __phone ) {
      if ( this.data.sms_type ) {
        return null;
      }
      SmsPhone( __phone, '07').then( res=> {
        // 登录
        const { status, data } = res;
        if ( status == 200 ) {

          wx.showToast({
            title: '发送验证码成功',
            icon: 'success',
            duration: 2000
          });
          this.sentCount();
        } else if (status == 400 ) {
          const { errorStatus } = data;
          if ( errorStatus == 17 ) {
            SmsPhone( __phone, '01' ).then( res => {
              // 注册
              const { status , data } =res;
              if ( status == 200 ) {
 
                wx.showToast({
                  title: '发送验证码成功',
                  icon: 'success',
                  duration: 2000
                });
                this.sentCount();
              }
            })
          } else {
            wx.showToast({
              title: '发送验证码失败',
              icon: 'error',
              duration: 2000
            });
          }
        }
      })
    } 
  },
  sentCount() {

    count = count - 1;
    const __value = `已发送(${ count }s)`
    if ( count > 0 ) {
      this.setData({
        'sms_value': __value,
        'sms_type': true, 
      })
      timer = setTimeout(() => {
        this.sentCount();
      }, 1000)
    } else {
      count = 60;
      this.setData({
        'sms_value': SMS_DEFAULT,
        'sms_type': false,
      })
      clearTimeout(timer);
      timer = null;
    }
  },
  login() {
    const __code = this.data.code;
    const __phone = this.data.phone;
    if ( __code && __phone) {
      const user = app.getUserInfo()
      const { openid ='', nickName = '', avatarUrl = '', unionid = '' } = user;
      PhoneLoginApi( __phone, __code , {
        openid: openid,
        nickName:nickName,
        avatarUrl:avatarUrl,
        unionid: unionid,
      } ).then( res => {
        const { status , data } = res;
        if ( status == 200 ) {
          const { errorStatus , errorMessage = '登录失败', userId, token } = data;
          if ( userId ) {
            app.setUserInfo({ userId,  token })
            app.setUid(userId);
            wx.navigateBack();
          } else if ( errorStatus == 14 ) {
            wx.showToast({
              title: '验证码过期',
              icon: 'error',
              duration: 2000
            });
          } else if ( errorStatus == 13 )  {
            wx.showToast({
              title: '验证码错误！',
              icon: 'error',
              duration: 2000
            });
          } else if (errorStatus == 18 ) {
            wx.showToast({
              title: '手机号已绑定',
              icon: 'error',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: errorMessage,
              icon: 'error',
              duration: 2000
            });
          }
        } else {
          const { errorMessage = '登录失败' }  = data;
          wx.showToast({
            title: errorMessage,
            icon: 'error',
            duration: 2000
          });
        }
        clearTimeout(timer);
        timer = null;
      }).catch( err => {
        clearTimeout(timer);
        timer = null;
        wx.showToast({
          title: '请求失败',
          icon: 'error',
          duration: 2000
        });
      })
    }
  },
})