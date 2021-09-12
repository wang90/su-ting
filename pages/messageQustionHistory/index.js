// pages/messageSystem/index.js
import { GetTalkList } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    title: '',
    value:'',
    city:'',
  },
  onLoad(option) {
    const msgId = option._id;
    this.getTalkList(msgId);
  },
  getTalkList(msgid) {
    const city =  app.getCity();
    const { cityid } = city;
    return GetTalkList( {
      cityCode: cityid,
      status: 1,
      pageNumb: 1,
      pageSize: -1,
    }).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        const curs = listData.filter( v => v.workOrderId === msgid); 
        if ( curs.length > 0 ) {
          const cur = curs[0];
          this.setData({
            title: cur.title,
            value: cur.content,
            city: cur.cityName,
          })
          return true
        } else {
          wx.showToast({
            title: '暂无历史数据',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },  
})