// pages/citylist/index.js
import { HomeListApi } from '../../apis/index.js';
import { citys } from '../../config/outfile.js';
import { GetLocation, GetCityCode } from '../../utils/location.js';

const app = getApp();
const defaultCitys = citys.map( v => { return v.list });
const __citys = defaultCitys.reduce(function(a,b) { return a.concat(b) });
Page({
  data: {
    indexList: citys.map( v => { return v.initial }),
    hots: [],
    location: '定位中...',
    citys: citys,
    search: [],
    value: '',
    myCity: null,
    topage: '',
  },
  onLoad( options ) {
    const topage = options.topage;
    if ( topage ) {
      this.setData({
        'topage': topage,
      });
    }
  },
  onShow() {
    GetLocation().then( res => {
      const { location, city } = res;
      this.setData({
        location: location,
      })
      const __data = GetCityCode( city );
      if ( __data.length > 0 ) {
        const __city = __data[0];
        const { code_id, name  } = __city;
        this.setData({
          myCity: {
            cityid: code_id,
            city: name,
          }
        })
      }
    })
    HomeListApi().then( res => {
      const { status, data } = res;
      if ( status === '200') {
        const { hotCityArray=[] } = data;
        this.setData({
          hots: hotCityArray,
        })
      }
    }).catch( err => { })
  },
  chooseCity( $event ) {
    const cityid = $event.currentTarget.dataset.cityid || '';
    const cityname = $event.currentTarget.dataset.cityname || '';
    const type = $event.currentTarget.dataset.type || '';
    if ( type === 'hot') {
      const __city = this.data.hots.filter( v => cityid === v.cityId )[0];
      app.setCity({
        cityid: cityid,
        city: __city.cityName,
      })
    }else if ( type ==='list') {
      app.setCity({
        cityid: cityid,
        city: cityname,
      })
    } else if ( type ==='search') {
      app.setCity({
        cityid: cityid,
        city: cityname,
      })
    }
    if (this.data.topage = 'houselist') {
      wx.redirectTo({
        url: `/pages/houselist/index`
      })
    } else {
      wx.navigateBack();
    }
   
  },
  onSearch($event) {
    const value = $event.detail;
    const __data = [];
    for ( let i = 0 ; i < __citys.length ; i ++ ) {
      const city = __citys[i];
      const { name } = city;
      if ( name.indexOf( value ) > -1 ) {
        __data.push( city )
      }
    }
    this.setData({
      search: __data,
    })
    this.setData({'value': value})
  },
  backPage() {
    if ( this.data.myCity ) {
      const __city = this.data.myCity;
      const { cityid, city } = __city;
      app.setCity({
        cityid: cityid,
        city: city,
      })
      wx.navigateBack();
    } else {
      wx.showToast({
        title: '未找到该地区',
        icon: 'error',
        duration: 2000
      });
    }
  }
})