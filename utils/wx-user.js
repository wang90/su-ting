import { GetOpenID } from '../apis/index.js';

export function wx_user_info () {
  return  new Promise(( relsove , rejvect ) => { 
    wx.getSetting({
      success (res) {
        if ( res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              const { userInfo } = res;
              if ( userInfo ) {
                relsove( userInfo );
              } else {
                revject('not user');
              }
            },
            fail: function(err) {
              revject(err);
            }
          })
        }
      },
      fail() {
        revject(err);
      }
      })
  })
}

export function wx_user_code () {
  return  new Promise((relsove , rejvect) => { 
    wx.login({
      success ( res ) {
        if (res.code) {
          const { code } = res;
          GetOpenID( code ).then( res => {
            const { status, data } = res;
            if ( status == 200 ) {
              relsove(data);
            }
            rejvect('status error');
          }).catch( err => {
            rejvect( err )
          });
        } else {
          rejvect('res.errMsg')
        }
      },
      fail(err) {
        rejvect(err);
      }
    })
  })
}