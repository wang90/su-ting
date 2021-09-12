// pages/login/index.js
import { GetOpenID, WxLogin, GetPhone } from '../../apis/index.js';
import { wx_user_info, wx_user_code } from '../../utils/wx-user.js';
const app = getApp();

Page({
  data: {
    agreement: false,
    phone: '',
    explanTips: false,
  },
  onShow() {
    if ( app.getUid() ) {
      wx.navigateBack()
    }
  },
  getWxLogin( $event ) {
    // wx login
    const { detail = null } = $event;
    if ( !detail ) {
      return null;
    }
    this.setData({ 'agreement': true })
    const { encryptedData , iv } = detail;
    if ( encryptedData && iv ) {
      this.getWxUserInfo().then( userinfo => {
        const { 
          nickName, 
          avatarUrl,
          openid,
          unionid,
          session_key } = userinfo;
          this.getUserPhone({ encryptedData , iv ,session_key }).then( phone => {
            this.setData({ phone: phone });
            app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key, phone })
            this.wxLogin({ nickName, avatarUrl, openid, unionid, phone })            
          }).catch(err => {})
      }).catch( err => {})
    } else {
      this.getWxUserInfo().then( userinfo => {
        const { 
          nickName, 
          avatarUrl,
          openid,
          unionid,
          session_key } = userinfo;
          app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key })
          this.wxLogin({ nickName, avatarUrl, openid, unionid })          
      }).catch( err => {})
    }
  },
  toPhoneLogin( $event ) {
    const { detail = null } = $event;
    if ( !detail ) {
      return null;
    }
    this.setData({ 'agreement': true })
    const { encryptedData , iv } = detail;
    if ( encryptedData && iv ) {
      this.getWxUserInfo().then( userinfo => {
        const { nickName, avatarUrl, openid,
          unionid, session_key } = userinfo;
          app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key })
        this.getUserPhone({ encryptedData , iv ,session_key }).then( phone => {
          this.setData({ phone: phone });
          app.setUserInfo({ phone })
          this.toPhone();
        }).catch( err=> {
          this.toPhone();
        })
      }).catch( err => {})
    } else {
      this.getWxUserInfo().then( userinfo => {
        const { 
          nickName, 
          avatarUrl,
          openid,
          unionid,
          session_key } = userinfo;
          app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key })
          this.toPhone();
      }).catch( err => {})
    }
  },
  wxLogin(__json) {
    const {  phone='', unionid, nickName, openid, avatarUrl } = __json;
    WxLogin({ phone, unionid, nickName, openid, avatarUrl } ).then( res => {
      const { status, data } = res;
      if ( status == '200' ) {
        const { errorStatus , userId, token } = data;
        if ( userId ) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          app.setUserInfo({ userId,  token })
          app.setUid(userId);
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'error',
            duration: 2000
          });
        }
          
        
      } else {
        const { errorMessage = '微信登录失败'} = data;
        wx.showToast({
          title: errorMessage,
          icon: 'error',
          duration: 2000
        });
      }
    })
  },

  getUserPhone({ session_key, encryptedData, iv }) {
    return new Promise(( reslove, reject) => {
      GetPhone({ 
        sessionKey: session_key, 
        encryptedData: encryptedData, 
        iv: iv, 
      }).then( res => {
          const { status, data } = res;
          if ( status == 200 ) {
            const { phone } = data;
            if ( phone ) {
              reslove( phone )
            } 
            reject('not phone')
          } else {
            const { errorMessage } = data;
            wx.showToast({
              title: errorMessage,
              icon: 'error',
              duration: 2000
            });
          }
          reject('not phone')
      }).catch( err => {
        reject( err )
      })
    })
  },
  
  getWxUserInfo() {
    return new Promise((relsove , rejvect) => {
      Promise.all([ wx_user_info(), wx_user_code() ]).then((result) => {
        const data  = {};
        for( let i = 0 ; i < result.length ; i ++ ) {
          const __result = result[i];
          Object.assign( data, __result )
        }
        app.setUserInfo( data )
        relsove( data )
      }).catch(( error ) => {
        rejvect(error);
      })
    })
  },


  getWXInfo( __data = {}) {
    return new Promise((reslove, rejvect ) => {
      const { encryptedData, iv } = __data;
      this.getWxCode().then( __code => {
        // 获取code
        GetOpenID( __code ).then( res => {
          const { status, data } = res;
          if ( status == 200 ) {
            const { session_key, openid, unionid } = data;
            this.getUserInfo().then( userInfo => {
              const { nickName, avatarUrl, gender, province, country, city } = userInfo;
              reslove({...userInfo, ...data })
            }).catch(err => {
              rejvect( err )
            })
          }
        }).catch( err => {
          rejvect( err )
        });
      })
    })
  },


  getUserInfo() {
    return new Promise(( relsove, revject ) => { 
      wx.getUserInfo({
        success: function(res) {
          const { userInfo } = res;
          if ( userInfo ) {
            relsove(userInfo);
          } else {
            revject('not user');
          }
        },
        fail: function(err) {
          revject(err);
        }
      })
    })
  },

  getWXPhone( session_key , encryptedData, iv ) {
    return new Promise(( res, rej ) => {
      GetPhone({ 
        sessionKey: session_key, 
        encryptedData: encryptedData, 
        iv: iv, 
      }).then( res => {
          const { status, data } = res;
          if ( status == 200 ) {
            const { phone } = data;
            if ( phone ) {
              res(phone)
            } 
            rej('not phone')
            
            // this.setData({ phone: phone });
            // app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key, phone })
            // this.toPhone();
          } 
          rej('not phone')
      }).catch( err => {
        rej( err )
      })
    })
  },
  getPhoneNumber1( $event ) {
    const { detail = null } = $event;
    if ( !detail ) {
      return null;
    }
    const { encryptedData , iv } = detail;
    this.setData({ 'agreement': true })
    this.getWxCode().then( code => {
      GetOpenID( code ).then( res => {
        const { status, data } = res;
        if ( status == 200 ) {
          const { session_key, openid, unionid } = data;
          this.getUserInfo().then( userInfo => {
            const { nickName, avatarUrl, gender, province, country, city } = userInfo;

            GetPhone({ 
              sessionKey: session_key, 
              encryptedData: encryptedData, 
              iv: iv, 
            }).then( res => {
                const { status, data } = res;
                if ( status == 200 ) {
                  const { phone } = data;
                  this.setData({ phone: phone });
                  app.setUserInfo({ nickName, avatarUrl, openid, unionid , session_key, phone })
                  this.toPhone();
                } 
            }).catch( err => {})
          }).catch(err => {})
        }
      }).catch( err => {})
    })
  },
  toPhone() {
    wx.navigateTo({
      url: `/pages/phone_login/index?phone=${ this.data.phone }`
    })
  },
  chooseExplan() {
    this.setData({
      explanTips: true,
    })
  },
  chooseAgreement() {
    const __active = !this.data.agreement
    this.setData({
      agreement: __active,
    })
  }
})