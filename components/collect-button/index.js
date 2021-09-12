import { HouseCollectApi } from '../../apis/index.js';
const app = getApp();
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    collect: {
      type: Number,
      value: 1,
    },
    houseid: {
      type: String,
      value: '',
    },
    url: {
      type: String,
      value:'',
    },
    active: {
      type: String,
      value: '',
    }
  },
  data: {

  },
  methods: {
    choose( $event ) {
        const uid = app.getUid();
        if ( !uid ) {
          wx.navigateTo({
            url: `/pages/login/index`
          })
          return null;
        }
        const houseid = this.data.houseid;
        if ( this.data.collect == 1 ) {
          const __this = this;
          wx.showModal({
            title: '',
            content: '是否不再收藏本房源?',
            success (res) {
              if (res.confirm) {
                __this.collectHttp( houseid, 2 );
              }
            }
          })
        } else {
          this.collectHttp( houseid, 1 )
        }      
    },
    collectHttp( houseid, type ) {
      HouseCollectApi({ houseid, type }).then( res => {
          const { status, data } =res;
          if ( status == 200 ) {
            if ( type === 2 ) {
              this.setData({ 'collect': false })
              this.triggerEvent( 'update', {
                houseid: houseid,
                type: false,
              })
            } else if ( type === 1 ) {
              this.setData({ 'collect': true })
              this.triggerEvent( 'update', {
                houseid: houseid,
                type: true,
              } )
            }
          } else {
            wx.showToast({
              title: type === 1 ? '收藏失败': '取消失败',
              icon: 'error',
              duration: 2000
            });
          }
      })
    },
    
  }
})
