// components/recommend-list/index.js
import { HomeSortListApi } from '../../apis/index.js';

Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
  },
  pageLifetimes:{
    show() {
      this.initList();
    },
  },
  data: {
    list:[],
    page: 1,
  },
  methods: {
    initList() {
      this.setData({'page': 1 })
      this.getList();
    },
    getList() {
      HomeSortListApi( {
        page: this.data.page,
      }).then( res => {
        const { status, data } = res;
        if ( status == '200' ) {
          const { listData = 0 } = data;
          if ( listData.length > 0 ) {
            const __list = this.data.list || [];
            this.setData({'list': __list.concat(listData) });
          } 
        }
      })
    },
    addList() {
      const __page = this.data.page;
      this.setData({
        'page': __page + 1,
      })
      this.getList();
    },
    toHouse( $event ) {
      const houseid = $event.currentTarget.dataset.houseid || '';
      wx.navigateTo({
        url: `/pages/house/index?_id=${ houseid }`,
      })
    },
  },
})
