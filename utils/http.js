import { hex_sha1 } from './sha1.js';
import { BASE_URL, reqID, appId,appkey } from '../config/index.js';
// const BASE_URL = 'https://www.xyjbooking.com/lvju/api'
// const reqID = 'A6946098809062'
// const appId = 'A6946098809062'
// const appkey = '1D08FBC1-A89B-42E0-C225-7C2FC250986D'

const app = getApp();

function Getuid() {
  return app.getUid() || null;
}
function GetToken() {
  return  app.getToken() || null;
}

function http ( __json ) {
  const { method = 'GET', url = '', data = {} } = __json;
  const reqDate = new Date().getTime();
  const reqKey = hex_sha1(`${ appId }UZ${ appkey }UZ${ reqDate }`);
  const headers = {
    'content-type': 'application/x-www-form-urlencoded;',
    'reqKey': reqKey.toUpperCase(),
    'reqDate': reqDate,
    'reqID': reqID,
  }
  const UID = Getuid();
  const token = GetToken();
  if ( token ) {
    const __token = hex_sha1( `${ UID }UZ${ token }UZ${ reqDate }` );
    headers['Token'] = __token.toUpperCase();
  }
  if ( UID ) {
    headers['UID'] = UID;
  }
  return new Promise(( resolve, reject ) => {
    wx.request({
      url: `${ BASE_URL }${ url }`,
      data: data,
      method: method,
      header: headers,
      success ( res ) {
        const { data } = res;
        if ( data.status == 200 ) {
          resolve( res.data );
        } else if ( data.status == 4001 ) {
          wx.showModal({
            title: '登录提示',
            content: '发现您登录已失效',
            confirmText: '重新登录',
            cancelText:'不了',
            success ( res ) {
              if (res.confirm) {
                app.clearUserInfo();
                wx.navigateTo({
                  url: `/pages/login/index`
                })
              } else if ( res.cancel ) {
                app.clearUserInfo();
              }
            }
          })
          reject('token error');
          // resolve(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail(err) {
        reject(err);
      }
    })
  }) 
}

module.exports = http;
