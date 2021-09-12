// pages/message/index.js
import { GetPendingApi, GetFinished } from '../../apis/index.js';
import { datedifference } from '../../utils/date.js';
const app = getApp();
Page({
  data: {
    active: 0,
    page: 1,
    page_pending: 1,
    page_finished: 1,
    pendingList: [],
    finishedList: [],
    message_pending: '正在加载中',
    message_finished: '正在加载中',
  },
  onShow() {
    if ( !app.getUid() ) {
      wx.navigateTo({
        url: `/pages/login/index`
      })
      return null;
    }
    if ( this.data.active == 0 ) {
      if ( this.data.page_pending ===1 && this.data.pendingList.length === 0 ) {
        this.setData({
          pendingList: [],
          finishedList: [],
          page_pending: 1,
          page_finished: 1,
        })
        this.getPending();
      }
    } else {
      if ( this.data.page_finished === 1 && this.data.finishedList.length === 0 ) {
        this.setData({
          pendingList: [],
          finishedList: [],
          page_pending: 1,
          page_finished: 1,
        })
        this.getFinished();
      }
    }
  },
  getPending() {
    GetPendingApi( this.data.page_pending ).then( res=> {
      const { status, data } = res;
      if ( status == 200 ) {
        const {  listData =[] } = data;
        const __list = this.data.pendingList;
        const __listData = listData.map( v => {
          v['__days'] = datedifference( v.rzsj,v.tfsj);
          return v;
        })
        this.setData({
          'pendingList': __list.concat( __listData ),
          'message_pending': __listData.length == 0 && this.data.page_pending == 1 ? '暂无订单' : '',
        })
      }
    })
  },
  getFinished() {
    GetFinished( this.data.page_finished ).then( res=> {
      const { status, data } = res;
      if ( status == 200 ) {
        const {  listData =[] } = data;
        const __list = this.data.finishedList;
        const __listData = listData.map( v => {
          v['__days'] = datedifference( v.rzsj, v.tfsj);
          return v;
        })
        this.setData({
          'finishedList': __list.concat( __listData ),
          'message_finished': __listData.length == 0 && this.data.page_finished == 1 ? '暂无订单' : '',
        })
      }
    })
  },
  onChange( $event ) {
    const detail = $event.detail;
    const { index } = detail;
    if ( index == 1 ) {
      if ( this.data.page_finished == 1 && this.data.finishedList.length == 0 ) {
        this.getFinished();
      } 
    } else {
      if ( this.data.page_pending == 1 && this.data.pendingList.length == 0 ) {
        this.getPending();
      } 
    }
  },
  toOrderPage( $event ) {
    const index = $event.currentTarget.dataset.orderid;
    wx.navigateTo({  
      url: `/pages/orderitem/index?_id=${ index }`
    })
  },
  onReachBottom: function () {
    this.addList();
  },
  addList() {
    if ( this.data.active === 1 ) {
      const __page = this.data.page_finished + 1;
      this.setData({
        page_finished: __page,
      })
      this.getFinished()
    } else {
      const __page = this.data.page_pending + 1;
      this.setData({
        page_pending: __page,
      })
      this.getPending()
    }
  },
  duringDate( start, end ) {
    console.log(start);
    console.log(end);
    return 1;
  }
})