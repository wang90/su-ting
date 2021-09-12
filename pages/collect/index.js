// pages/collect/index.js
import { GetCollectList } from '../../apis/index.js';

Page({
  data: {
    list: [],
    page: 1,
    showSort: false,
  },
  onShow( options ) {
    this.getCollectList();
  },
  onReachBottom() {
    // this.addList();
    this.getCollectList();
  },
  getCollectList() {
    GetCollectList( this.data.page ).then( res => {
      const { status, data } = res;
      if ( status == 200 ) {
        const { listData } = data;
        if ( this.data.page === 1 && listData.length === 0 ) {
          this.setData({ 'showSort': true });
          return null;
        }
        if ( listData.length > 0 ) {
          const __arr = this.data.list;
          const __page = this.data.page + 1;
          const __json = {
            'list': __arr.concat(listData),
            'page': __page,
          }
         
          this.setData( __json );
        }
      }
    })
  },
  toSearch() {
    wx.navigateTo({
      url: `/pages/houselist/index`
    })
  },
  update( $event ) {
    const { detail = null } = $event;
    if ( detail ) {
      const { houseid } = detail;
      if ( houseid ) {
        const __list = this.data.list;
        for ( let i = 0; i < __list.length ; i ++ ) {
          const cur = __list[i];
          if ( cur.housResoId  === houseid ) {
            __list.splice( i, 1 );
            this.setData({
              list: __list,
            })
            break;
          }
        }
      }
    }
  }
})