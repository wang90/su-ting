// pages/home/index.js
import { HomeListApi } from '../../apis/index.js';
import { GetLocation, GetCityCode } from '../../utils/location.js';
const app = getApp();
const houseType = {
  '02': '体验当地特色生活',
  '33': '释放压力，休闲之行',
  '03':  '质感旅行，服务更优！',
  '04':  '自由方便，精致出行。',
  '34':'配套完善，温馨入住。',
}

Page({
  data: {
    types: [],
    hots: [],
    city: '三亚市',
    banners: [],
    startTimer:'',
    endTimer:'',
    days:'',
    houseType: houseType,
    location_status: false,
  },
  // 跳转页面部分
  toSearch ( $event ) {
    const cityid = $event.currentTarget.dataset.cityid || '';
    const typeid = $event.currentTarget.dataset.typeid || '';
    let query = '';
    if ( cityid ) {
      const __city = this.data.hots.filter(v=> v.cityId === cityid )[0]
      app.setCity({
        cityid: cityid,
        city: __city.cityName,
      })
      query = `?cityid=${ cityid }`
    } else if ( typeid ) {
      query = `?typeid=${ typeid }`
    }
    wx.navigateTo({
      url: `/pages/houselist/index${ query }`,
    })
  },
  toCity( $event ) { 
    const topage = $event.currentTarget.dataset.topage || '';
    let url = '/pages/citylist/index';
    if ( topage ) {
      url += `?topage=${ topage }`
    }
    wx.navigateTo({
      url: url,
    })
  },
  toDate() {
    wx.navigateTo({
      url: '/pages/datepage/index'
    })
  },
  toHouse() {
    wx.navigateTo({
      url: '/pages/datepage/index'
    })
  },
  onShow() {
    this.getCity();
    this.getDate();
    this.getlist();
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
    if ( __dates ) {
      const { start, end, days } = __dates;
      const __start = start.split('-');
      const __end = end.split('-');
      this.setData({
        startTimer: `${ __start[1] }月${ __start[2] }日`,
        endTimer:  `${ __end[1] }月${ __end[2] }日`,
        days: days,
      })
    } else {
      this.setData({
        startTimer: null,
        endTimer: null,
        days: null,
      })
    }
  },
  getlist() {
    HomeListApi().then( res => {
      const { status, data } = res;
      if ( status === '200') {
        const { 
          bannerArray = [], 
          hotCityArray=[],
          housTypeArray=[],
          housInfoArray=[] } = data;
        const __banners = bannerArray.map( v => {
          return v.imgsrc;
        })
        this.setData({
          types: housTypeArray,
          hots: hotCityArray,
          banners: __banners || [],
        })
      }
    }).catch(err => {})
  },
  bindlocation() {
    this.setData({'location_status': true });
      GetLocation('city').then( res => {
        const { city } = res;
        console.log("------")
        console.log(res)
        console.log(city)
        console.log("------")
        const __data = GetCityCode(city)
        console.log(__data)
        if ( __data.length > 0 ) {
          const { code_id, name } = __data[0]
          this.setData({
            city: name,
            cityid: code_id,
            location_status: false,
          })
          app.setCity({
            cityid: code_id,
            city: name,
          })
          // wx.navigateBack();
          wx.showToast({
            title: '定位成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          this.setData({
            location_status: false,
          })
          wx.showToast({
            title: '未找到该地区',
            icon: 'error',
            duration: 2000
          });
        }
      }).catch((err) => {
        this.setData({
          location_status: false,
        })
        wx.showToast({
          title: err,
          icon: 'error',
          duration: 2000
        });
      })
  },
  onShareAppMessage: function () {
    
  }
})