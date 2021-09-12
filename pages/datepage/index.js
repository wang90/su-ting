// pages/datepage/index.js
import { strToDate, dateToStr, datedifference, dateToSimp, formatDate } from '../../utils/date.js';
import { GetHouseMsg } from '../../apis/index.js';

const app = getApp();

Page({
  data: {
    houseid: '',
    text: '',
    show: false,
    start: '-',
    end: '-',
    days: '-',
    startT:'',
    endT: '',
    __satrtT: '',
    __endT:'',
    topage: null,
    formatter( day ) {
      if ( day.type === 'start') {
        day.topInfo = '入住';
        day.bottomInfo = '';
      } else if (day.type === 'end') {
        day.topInfo = '离店';
        day.bottomInfo = '';
      }
      return day;
    },
  },
  onLoad( options ) {
    const houseid = options.houseid;
    const topage = options.topage;
    if ( houseid ) {
      this.setData({
        'houseid': houseid,
      });
      this.getHouseMsg();
    }
    if ( topage ) {
      this.setData({
        'topage': topage,
      });
    }
  },
  onShow() {
    const __date = app.getTimer();
    if ( __date ) {
      const { start, end, days } = __date;
      const __start = strToDate(start);
      const __end = strToDate(end);
      const __min = dateToSimp(start);
      const __max = dateToSimp(end);
      const defaultDate = [ __min, __max ];
      this.setData({
        start: __start,
        end: __end,
        days: days,
        startT: start,
        endT: end,
        defaultDate: defaultDate,
        __startT: start,
        __endT: end,
      })
    } else {
      this.setData({
        start: '-',
        end: '-',
        days: '-',
        defaultDate: [],
      })
    }
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm( $event ) {
    const __date = $event.detail;
    let __startT = dateToStr(__date[0]);
    let __endT = dateToStr(__date[1]);
    this.setData({
      show: false,
      __startT: __startT,
      __endT: __endT,
    });
  },
  clear() {
    this.setData({
      defaultDate: [],
      startT:'',
      endT: '',
      __satrtT: '',
      __endT:'',
      start: '-',
      end: '-',
      days: '-',
    })
  },
  save() {
    if ( this.data.__startT && this.data.__endT) {
      const __start = this.data.__startT;
      const __end = this.data.__endT;
      const start = strToDate(__start);
      const end = strToDate(__end);
      const days = datedifference( __start, __end );
      this.setData({
        start: start,
        end: end,
        days: days,
      })
      app.setTimer({
          'start': __start,
          'end': __end,
      })
    } else {
      app.clearTimer()
    }
    if ( this.data.topage ) {
      if ( this.data.__startT && this.data.__endT ) {
        const houseid = this.data.houseid;
        if ( this.data.topage === 'order' && houseid ) {
          wx.redirectTo({
            url: `/pages/order/index?_id=${ houseid }`
          })
        } else {
          wx.navigateBack();
        }
      } else {
        wx.showToast({
          title: '没有添加日期',
          icon: 'error',
          duration: 2000
        })        
      }
      
    } else {
      wx.navigateBack();
    }
    
  },
  getHouseMsg() {
    GetHouseMsg( this.data.houseid ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { calendarArray , weekPrice, datePrice, bookedInfo = {} } = data;
        const __calendarArray = Object.values(calendarArray) || [];
        //解析特价日期时候的key&value
        let Calendar = {};
        if ( __calendarArray.length > 0  ) {
          for ( let i = 0 ; i < __calendarArray.length ; i ++ ) {
            const __days = __calendarArray[i] || {};
            Calendar = Object.assign( Calendar, __days);
          }
        } 
        this.setData({
          formatter( day ) {
            if ( day.type === 'start') {
              day.topInfo = '入住';
            } else if (day.type === 'end') {
              day.topInfo = '离店';
            }
            const { date } = day;
            const year = date.getFullYear();
            const __month = date.getMonth() + 1;
            const curWeek = date.getDay();
            const __date = formatDate(date);
            const __day = date.getDate();
            const current = `${ year }${ __month < 10 ? `0${__month}`: __month }`;
            let bottomInfo = '';
            if ( bookedInfo[ current ] ) {
              const __curday = String( __day < 10 ? `0${__day}`: __day );
              if ( bookedInfo[ current ].indexOf(__curday) > -1 ) {
                bottomInfo = `已预定`;
              }
            }
            if ( bottomInfo === '') {
              if ( Calendar[__date]) {
                bottomInfo = `¥${ Calendar[__date] }`; 
              } else if ( curWeek === 6 || curWeek === 0 ) {
                bottomInfo = `¥${ weekPrice }`;
              } else {
                bottomInfo = `¥${ datePrice }`;
              }
            }
            
            day.bottomInfo = bottomInfo;
            return day;
          },
        })
      }
    }).catch( err => {})
  },
})