// pages/house/index.js
import { GetHouseMsg, DiscountHouseMoney, GetHouseDiscount, AddHistoryApi } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    houseid: '',
    title: '',
    image: '',
    images: [],
    square: '',
    collected: false,
    fwcx: '',
    description: '',
    comment: null,
    furnishArray: [],
    furnishArray1:[],
    housePicArray: [],
    yajin: '',
    xzxb: 0,
    tfsj: '',
    rzsj: '',
    kzrs:'',
    srcs: '',
    gdtcw: '',
    checkOurTreaty: '',
    cuzutype: '',
    huxing: '',
    desAuto: false,
    city: '',
    startTimer: '',
    endTimer: '',
    days: '',
    explanTips: false,
    discounts: [],
    discountTips: false,
    bookInfo: false,
  },
  onLoad( option ) {
    const houseid = option._id;
    if ( houseid ) {
      this.setData({
        'houseid': houseid,
      });
      this.getDate();
      this.getHouseMsg();
      AddHistoryApi( houseid ).then(res=>{}).catch(err=>{})
    } 
  },
  onShow() {
    this.getDate();
    this.getCity();
    this.getHouseMsg();
    this.getHouseDiscount();
  },
  getCity() {
    const __city = app.getCity();
    const { city, cityid } = __city;
    if ( city ) {
      this.setData({
        city: city
      })
    }
  },
  getDate() {
    const __dates = app.getTimer();
    if ( __dates )  {
      const { start, end, days } = __dates;
      const __start = start.split('-');
      const __end = end.split('-');
      this.setData({
        startTimer: `${ __start[1] }月${ __start[2] }日`,
        endTimer:  `${ __end[1] }月${ __end[2] }日`,
        days: days,
        start: start,
        end: end,
      })
    } else {
      this.setData({
        startTimer: `-`,
        endTimer: `-`,
        days: '-',
        start: '',
        end: '',
      })
    }
   
    
  },
  getHouseDiscount() {
    GetHouseDiscount( this.data.houseid, this.data.start, this.data.end ).then( res => {
      const { status, data = []} = res;
      if ( status == '200' ) {
        this.setData({
          discounts: data
        })
      } 
    })
  },
  getHouseMsg() {
    GetHouseMsg( this.data.houseid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { 
          title, imgsrcSL, square, 
          isType, fwcx, description, 
          yajin,xzxb = 0,tfsj ='',rzsj ='',
          kzrs = '', srcs= '',gdtcw ='',checkOurTreaty,
          customMoney,
          huxing,
          cuzutype,
          lat = '',
          lon = '',
          bookedInfo = null,
          comment = null, furnishArray = [],housPicArray =[] } = data;
        let bookInfo = false;
        if ( bookedInfo ) {
          const start =  this.data.start;
          const end = this.data.end;
          const days = this.data.days;
          if ( start && end ) {
            const __start = start.split('-');
            const __end = end.split('-');
            const __startTimer = `${ __start[0] }${ __start[1] }`;
            const __startDays = __start[2];
            const __endTimer = `${ __end[0] }${ __end[1]}`;
            const __endDays = __end[2];
            const __startdays = [];
            for ( let i = 0 ; i < days ; i ++ ) {
              if ( Number(__startDays) + i > 32) {
                continue;
              }
              __startdays.push( String(Number(__startDays) + i) );
            }
            if ( bookedInfo[__startTimer] ) {
              const __cur = bookedInfo[__startTimer].filter( v => {
                if ( __startdays.indexOf(v) > -1) {
                  return v;
                }
              });
              if ( __cur.length > 0 ) {
                bookInfo = true;
              }
            } 
            if ( bookInfo == false) {
              if ( bookedInfo[__endTimer]) {
                const __enddays = [];
                for ( let i = 0 ; i < days ; i ++ ) {
                  if ( Number(__endDays)  - i < 0) {
                    continue;
                  }
                  __enddays.push(String(Number(__endDays)  - i));
                }
                const __cur = bookedInfo[__endTimer].filter( v => {
                  if ( __enddays.indexOf(v) > -1 ) {
                    return v;
                  }
                });
                if ( __cur.length > 0 ) {
                  bookInfo = true;
                }
              }
            }

          }
        }

        this.setData({
          'title': title,
          'image': imgsrcSL,
          'square': square,
          'collected': isType,
          'huxing': huxing,
          'fwcx': fwcx,
          'description': description,
          'comment': comment,
          'furnishArray': furnishArray,
          'furnishArray1': furnishArray,
          'housePicArray': housPicArray,
          'yajin': yajin,
          'xzxb': xzxb,
          'rzsj': rzsj,
          'kzrs': kzrs, 
          'srcs': srcs,
          'tfsj': tfsj,
          'gdtcw': gdtcw,
          'checkOurTreaty':checkOurTreaty,
          'cuzutype': cuzutype,
          'latitude': lat,
          'longitude': lon,
          'customMoney': customMoney,
          'images': housPicArray,
          'bookInfo': bookInfo,
        })
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    }).catch( err => {})
  },
  toTimer() {
    wx.navigateTo({
      url: `/pages/datepage/index?houseid=${ this.data.houseid }`
    })
  },
  autoDescription(){
    const __tips = !this.data.desAuto;
    this.setData({
      'desAuto': __tips,
    })
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success(res) {},
      fail(err) {}
    })
  },
  toComment() {
    wx.navigateTo({
      url: `/pages/common/index?_id=${ this.data.houseid }`,
    })
  },
  checktCount() {
    const __dates = app.getTimer();
    const { start, end } = __dates;
    DiscountHouseMoney({
      houseid: this.data.houseid,
      startTime: start,
      endTime: end,
    }).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { newMoney, originalPrice } =data;
        this.setData({
          customMoney: newMoney,
          datePrice: originalPrice,
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `./pages/house/index?_id=${ this.data.houseid }`,
    }
  },
  showExplan() {
    this.setData({'explanTips': true })
  },
  collectUpdate( type ) {
    this.setData({
      'collected': type
    })
  },
  onDiscountClose() {
    this.setData({
      discountTips: false,
    })
  },
  toSpecial() {
    this.setData({
      discountTips: true,
    })
  },
})