// pages/houselist/index.js
import { HomeSortListApi } from '../../apis/index';

const app = getApp();

Page({
  data: {
    page: 1,
    list: [],
    msg_title: '获取数据中',
    typeid: '',
  },
  onReachBottom: function () {
    this.addList();
  },
  onShareAppMessage: function () {

  },
  onLoad( option ) {
    const { typeid } = option;
    this.getDate();
    this.getCity();
    if ( typeid ) {
      this.setData({ 'typeid': typeid })
      this.getHouseList({
        'housResoTypeArray': JSON.stringify( new Array({ 'pHousTypeId': typeid }))
      })
    } else {
      this.getInitList();
    }
  },
  onShow( option ) {
    if ( this.data.cityid ) {
      const __city = app.getCity();
      const { cityid } = __city;
      const __date = app.getTimer() || {};
      const { start = null, end  = null } = __date;
      if ( cityid !== this.data.cityid || start !== this.data.start || end !== this.data.end ) {
        this.getDate();
        this.getCity();
        this.getInitList();
      }   
    }
  },
  getCity() {
    const __city = app.getCity();
    const { city, cityid } = __city;
    if ( city ) {
      this.setData({
        city: city,
        cityid:  cityid,
      })
    }
    return cityid;
  },
  getDate() {
    const __dates = app.getTimer();
    if ( __dates ) {
      const { start, end } = __dates;
      const __start = start.split('-');
      const __end = end.split('-');
      __start.shift();
      __end.shift();
      this.setData({
        start: start,
        end: end,
        timer: `${ __start.join('.') }-${ __end.join('.') }`,
      })
      return {
        start:start,
        end: end,
      }
    } else {
      this.setData({
        start: '',
        end: '',
        timer: `添加日期`,
      })
      return {
        start:'',
        end:'',
      }
    }
    
  },
  getInitList() {
    this.setData({
      page: 1,
      curtype: '',
      list: [],
    })
    this.getHouseList();
  },
  getHouseList( json = null ) {
    const __data = json || {};
    __data['page'] = this.data.page;
    __data['cityid'] = this.data.cityid;
    if ( this.data.start && this.data.end ) {
      __data['start'] = this.data.start;
      __data['end'] = this.data.end;  
    }
   
    HomeSortListApi( __data ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        const __arr = this.data.list;
        const __json = {
          'list': __arr.concat(listData),
        }
        if ( listData.length === 0 &&this.data.page === 1 ) {
          __json['msg_title'] = '暂无数据'
        }
        this.setData( __json )
      }
    }).catch( err => {})
  },
  addList() {
    const __page = this.data.page + 1;
    this.setData({
      page: __page,
    })
    this.getHouseList();
  },
  update( $event ) {
    const detail = $event.detail;
    const __json = detail;
  
    this.setData({
      page: 1,
      list: [],
    })
    this.getHouseList( __json );
  }
})