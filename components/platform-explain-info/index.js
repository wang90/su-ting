// components/customer-call/index.js
import { GetPlatformExplainInfo } from '../../apis/index.js';
const WxParse = require('../wx-parse/wxParse.js');
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: '01'
    }
  },
  attached() {
    GetPlatformExplainInfo( this.data.type ).then(res=> {
      const { status, data } = res;
      if ( status == '200' ) {
        const { listData } = data;
        if ( listData.length > 0 ) { 
          const __data = listData[0];
          const { commount } = __data;;
          WxParse.wxParse('article', 'html', commount, this, 5);
        }
      }
    })
  },
  methods: {
    onClose() {
      this.setData({'show': false })
    },
  }
})
