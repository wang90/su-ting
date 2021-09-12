// components/houset-item/index.js
import { HouseCollectApi } from '../../apis/index.js';

const app = getApp();

Component({
  properties: {
    houseid:{
      type:String,
      value: '',
    },
    image:{
      type:String,
      value:'',
    },
    collect: {
      type: Number,
      value: 0,
    },
    huxing:{
      type: String,
      value:'',
    },
    kzrs:{
      type: String,
      value:'',
    },
    title:{
      type: String,
      value:'',
    },
    money:{
      type: String,
      value:'',
    },
    comments:{
      type: String,
      value:'',
    },
    furnishArray: {
      type:Array,
      value: [],
    }
  },
  methods: {
    collectUpdate( $event ) {
      const {  detail = null } = $event;
      if ( detail ) {
        const { houseid , type } = detail;
        if ( type === false ) {
          this.triggerEvent('update', { 
            houseid: houseid,
          })
        }
      }
    },
    // chooseCollect($event) {
    //   const uid = app.getUid();
    //   if ( !uid ) {
    //     wx.navigateTo({
    //       url: `/pages/login/index`
    //     })
    //     return null;
    //   }
    //   const houseid = $event.currentTarget.dataset.houseid;
    //   if ( this.data.collect ) {
    //     const __this = this;
    //     wx.showModal({
    //       title: '',
    //       content: '是否不再收藏本房源?',
    //       success (res) {
    //         if (res.confirm) {
    //           __this.collectHttp( houseid, 2 );
    //         }
    //       }
    //     })
    //   } else {
    //     this.collectHttp( houseid, 1 )
    //   }      
    // },
    // collectHttp( houseid, type ) {
    //   HouseCollectApi({ houseid, type }).then( res => {
    //       const { status, data } =res;
    //       if ( status == 200 ) {
    //         if ( type === 2 ) {
    //           this.setData({ 'collect': false })
    //         } else if ( type === 1 ) {
    //           this.setData({ 'collect': true })
    //         }
    //       } else {
    //         wx.showToast({
    //           title: type === 1 ? '收藏失败': '取消失败',
    //           icon: 'error',
    //           duration: 2000
    //         });
    //       }
    //   })
    // },
    toHouse( $event ) {
      const houseid = $event.currentTarget.dataset.houseid;
      wx.navigateTo({
        url: `/pages/house/index?_id=${ houseid }`
      })
    },
  }
})
