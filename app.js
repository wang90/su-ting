import { GetLocation } from './utils/location.js';
import { GetStorage, SetStorage, ClearStorage } from './utils/storage'; 
import { STRONG_KEY } from './config/index.js';
import { datedifference , formatDate } from './utils/date.js';
import {  GetSysInfo } from './utils/system.js';

App({
  onLaunch ( options ) {
    if ( !this.globalData.cityid ) {
      this.setCity({
        city: '三亚',
        cityid: '460200'
      })
    }
    GetStorage( STRONG_KEY ).then( __value => {
      if ( __value ) {
        const { 
          userId = null, 
          token = null, 
          nickName = '', 
          avatarUrl = '', 
          phone = ''  } = __value;
        if ( userId ) {
          this.setUid( userId )
          if ( token ) {
            this.setUserInfo({ 
              userId, token, nickName, phone, avatarUrl,
            })
          }
        }
      }
    });

    if ( !this.globalData.startTimer ) {
      const __date = new Date().getTime();
      const startTimer = formatDate(__date);
      const endTimer = formatDate(__date + 86400 *1000)

      this.globalData.startTimer = startTimer ;
      this.globalData.endTimer = endTimer;
      this.globalData.days = 1;
    }

    GetSysInfo().then((res) => {
      const { customBar, custom, statusBar } = res;
      this.globalData.statusBar = customBar; //状态栏高度
      this.globalData.custom = custom;
      this.globalData.customBar = statusBar - 20;
    }).catch(() => {})
  },
  onShow ( options ) {
    if ( !this.globalData.startTimer ) {
      const __date = new Date().getTime();
      const startTimer = formatDate(__date);
      const endTimer = formatDate(__date + 86400 *1000)
    
      this.globalData.startTimer = startTimer ;
      this.globalData.endTimer = endTimer;
      this.globalData.days = 1;
    }
  },
  globalData: {
    'city': '',
    'startTimer': '',
    'endTimer': '',
    'days': '1',
    'hotConfig': [],
    'typeConfig': [],
    'uid': '',
    'user': {},
    'persion': [], // 入住人信息 arrary
    'special': null, // 优惠卷信息  dict
    'invoice': null, // 发票信息 dict
  },
  // 全局函数设置部分
  setUserInfo( data ) {
    const user = this.globalData.user || {};
    let isUpdate = false;
    for ( const key in data ) {
      const __val = data[key];
      const __oldVal =  user[key] || null;
      if (  __oldVal === null || user[key] !== __val ) {
        user[key] = __val;
        isUpdate = true;
      }
    }
    if ( isUpdate ) {
      this.globalData.user = user;
      SetStorage( STRONG_KEY, user ).then(res => {}).catch(()=>{})
    }
  },
  getUserInfo( key ) {
    const user = this.globalData.user || null;
    if ( !this.globalData.user ) {
      return null;
    }
    if ( key ) {
      return user[key];
    }
    return user;
  },
  setUid( uid ) {
    this.globalData.uid = uid;
  },
  getUid() {
    return this.globalData.uid || null;
  },
  clearUserInfo() {
    this.globalData.user = null;
    this.globalData.uid  = '';
    ClearStorage().then();
  },
  getToken() {
    if ( !this.globalData.user ){
      return null;
    }
    return this.globalData.user.token || null;
  },
  isLogin() {
    if ( !this.getUid() ) {
      wx.navigateTo({
        url: `/pages/login/index`
      })
      return false;
    }
    return true;
  },
  setCity( json ) {
    const { city = '' , cityid = '' } = json;
    this.globalData.city = city;
    this.globalData.cityid = cityid;
  },
  getCity() {
    return {
      'city' : this.globalData.city,
      'cityid': this.globalData.cityid,
    }
  },
  setTimer( json ) {
    const { start , end } = json;
    const __days = datedifference( start , end );
    this.globalData.startTimer = start;
    this.globalData.endTimer = end;
    this.globalData.days = __days;
  },
  getTimer() {
    if ( this.globalData.startTimer &&  this.globalData.endTimer) {
      return {
        start: this.globalData.startTimer,
        end: this.globalData.endTimer,
        days: this.globalData.days,
      }
    }
    return null;
  },
  clearTimer() {
    this.globalData.startTimer = null;
    this.globalData.endTimer = null;
    this.globalData.days = null;
  },
  setOrderMsg( key , value) {
    if ( this.globalData.hasOwnProperty(key) ) {
      console.log(value)
      this.globalData[key] = value;
      return true;
    }
    return false;
  },
  getOrderMsg( key ) {
    if ( this.globalData.hasOwnProperty(key) ) {
      return this.globalData[key];
    }
    return {
      'persion': this.globalData.persion, // 入住人信息
      'special': this.globalData.special, // 优惠卷信息
      'invoice': this.globalData.invoice, // 发票信息
    }
  }
})