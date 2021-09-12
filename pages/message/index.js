// pages/message/index.js
import { GetMessageList, GetTalkList, ReadEmptyMessage } from '../../apis/index.js';
const app = getApp();
Page({
  data: {
    active: 0,
    page_sys: 1,
    page_talk: 1,
    sysList: [],
    talkList: [],
    message_sys: '数据加载中',
    message_talk: '数据加载中',
    tips: false,
  },
  onShow() {
    if ( !app.getUid() ) {
      wx.navigateTo({
        url: `/pages/login/index`
      })
      return null;
    }
    this.getSysList();
  },
  getSysList() {
    return GetMessageList( this.data.page_sys ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        this.setData({
          'sysList': listData,
          'message_sys': this.data.page_sys === 1 && listData.length === 0 ? '暂无消息': '',
        })
      }
    })
  },
  getTalkList() {
    const city =  app.getCity();
    const { cityid } = city;
    return GetTalkList( {
      cityCode: cityid,
      status: 1,
      pageNumb: this.data.page_talk }).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData = [] } = data;
        this.setData({
          'talkList': listData,
          'message_talk': this.data.page_talk === 1 && listData.length === 0 ? '暂无消息': '',
        })
      }
    })
  },  
  onChange( $event ) {
    const detail = $event.detail;
    const { index } = detail;
    this.setData({'active': index })
    if ( index == 1 ) {
      if ( this.data.talkList.length === 0 && this.data.page_talk === 1 ) {
        this.getTalkList();
      }
    }
  },
  chooseTalk( $event ) {
    const index = $event.currentTarget.dataset.messageid;
    wx.navigateTo({
      url: `/pages/messageServices/index?_id=${ index }`
    })
  },
  toQusetion() {
    wx.navigateTo({
      url: `/pages/messageQustion/index`
    })
  },
  chooseMessageCard($event) {
    const index = $event.currentTarget.dataset.messageid;
    const type = $event.currentTarget.dataset.messagetype;
    const orderid = $event.currentTarget.dataset.orderid;
    if ( type == 1) {

    } else if ( type == 2 ) {

      if ( orderid ) {
        wx.navigateTo({
          url: `/pages/orderitem/index?_id=${ orderid }`
        })
      }
    } else if ( type == 3 ) {

      if ( orderid ) {
        wx.navigateTo({
          url: `/pages/orderitem/index?_id=${ orderid }`
        })
      }
      
    } else if ( type == 4 ) {
      wx.navigateTo({
        url: `/pages/special/index`
      })
    } else if ( type == 5 ) {

    } else if ( type == 6 ) {
      wx.navigateTo({
        url: `/pages/authon/index`
      })
    } else if ( type == 7) {

    }
  },
  chooseShow() {
    const __tips = !this.data.tips;
    this.setData({'tips': __tips })
  },
  tipsAction($event) {
    const type = $event.currentTarget.dataset.type;
    if ( type === 'read') {
      this.readEmptyMessage(1)
    } else if ( type ==='clear') {
      this.readEmptyMessage(2);
    }
    this.setData({'tips': false })
  },
  readEmptyMessage( type ) {
    ReadEmptyMessage( type ).then( res=> {
      const { status, data } = res;
      if ( status == 200 ) {
        this.infoSysList();
      }
    })
  },
  infoSysList(){
    this.setData({
      page_sys: 1,
      sysList: [],
    })
    this.getSysList();
  }
})