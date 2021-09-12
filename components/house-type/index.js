// components/house-type/index.js
import { GetSearchCodeApi } from '../../apis/index';
const app = getApp();
const MAX_MONEY = 10000;
const tabdata = [
  {
    'type': 'sort',
    'name': '推荐排序',
    'active':false
  },
  {
    'type': 'money',
    'name': '价格范围',
    'active':false
  },
  {
    'type': 'housetype',
    'name': '房源类型',
    'active':false
  },
  {
    'type':'more',
    'name': '更多筛选',
    'active':false,
  }
]
const  moneydata = [
  {'type': 1, 'value':'￥0-￥200','active': false,'start': 0,'end':200},
  {'type': 2, 'value':'￥200-￥600','active': false,'start': 200,'end':600},
  {'type': 3, 'value':'￥600-￥1600','active': false,'start': 600,'end':1600,'style':'small'},
  {'type': 4, 'value':'￥1600以上','active': false, 'start': 1600,'end':MAX_MONEY},
];
const sortdata = [
  {'type':'tuijian','value': '推荐排序','key': 1 },
  {'type':'good','value': '好评优先','key': 2 },
  {'type':'slow','value': '低价优先','key': 3 },
  {'type':'hight', 'value': '高价优先', 'key': 4},
]
const easydata = [];
const unitdata = [];
const rentdata = [];
const housetypedata =[];
const moneySlder = [0,200,400,600,800,1000,1200,1400,1600,'1600+']
Component({
  properties: {
    typeid: {
      type: String,
      value: '',
    },
    city: {
      type:String,
      value:'',
    },
    timer: {
      type:String,
      value:'',
    },
  },
  data: {
    sortTitle: sortdata[0].value,
    active:'',
    tabdata: tabdata,
    sortdata: sortdata,
    housetypedata: housetypedata,
    moneydata: moneydata,
    rentdata: rentdata,
    unitdata: unitdata,
    easydata: easydata,
    startTimer: '',
    endTimer: '',
    hightMoney: 0,
    lowMoney:0,
    curpeople: 0,
    lowPeople: 0,
    hightPeople: 0,
    days: '',
    show: false,
    sortTips: false,
    moneyTips: false,
    houseTips: false,
    moreTips: false,
    moneySlder: moneySlder,
    __hightMoney: 0,
    __lowMoney:0,
    lastType: '',
    moreIndex: 0,
  },
  attached() {
    const statusBar = app.globalData.statusBar;
    const customBar = app.globalData.customBar;
    this.setData({
      statusBar: statusBar,
      customBar: customBar,
    })
    this.getSearchCode();
  },
  pageLifetimes:{

  },
  methods: {
    toCity() {
      wx.navigateTo({
        url: `/pages/citylist/index`
      })
    },
    toTimer() {
      wx.navigateTo({
        url: `/pages/datepage/index`
      })
    },
    getSearchCode() {
      // 获取数据请求 
      GetSearchCodeApi().then( res => {
        const{ status, data } = res;
        if ( status == 200 ) {
          let { 
            amenitiesArray = [], 
            housResoArray= [], 
            houseOrientArray= [], 
            housingLayoutArray= [],
            lendArray = [] } = data;
  
            if ( housResoArray.length > 0 ) {
              housResoArray = housResoArray.map( v => {
                if ( v.code === this.data.typeid ) {
                  v.active = true;
                } else {
                  v.active = false;
                }
                return v;
              })
            }
            this.setData({
              easydata: amenitiesArray,
              housetypedata: housResoArray,
              unitdata: housingLayoutArray,
              rentdata: lendArray,
            })
            this.checkTips();
        }
      })
    },
    chooseMoney( index ) {
      const __data  = [ ...this.data.moneydata ];
      const curdata = __data.filter( v => v.active )
      const __start = curdata.map(v => v.start)
      const __end = curdata.map(v => v.end);
      let start = 0;
      let end = 0;
      if ( __start.length > 0 ) {
        start = Math.min.apply(null, __start) || 0;
      }
      if ( __end.length > 0 ) {
        end = Math.max.apply(null, __end) || 0;
      }
      let __hightMoney = 0;
      let __lowMoney =  moneySlder.indexOf(start);
      if ( end === MAX_MONEY ) {
        end = __data[3].start + '以上'
        __hightMoney = 10;
      } else {
        __hightMoney = moneySlder.indexOf(end)
      }
      this.selectComponent("#zy-slider").reset()
      this.selectComponent("#zy-slider").setSliderPostion()
      this.selectComponent("#zy-slider").show()
  
      this.setData({
        'hightMoney': end,
        'lowMoney': start,
        '__hightMoney': __hightMoney,
        '__lowMoney':__lowMoney,
      })
    },
    onDragPeople( $event ) {
      const value = $event.detail.value;
      this.setData({
        'curpeople': Math.floor( value/10 ),
      })
    },
    filterPamrs() {
      const data = {};
      const __sortdata = this.data.sortdata.filter( v => v.active === true );
      if ( __sortdata.length > 0  ) {
        data['orderIndex'] = __sortdata[0].key;
      }

      const __moneydata = this.data.moneydata.filter( v => v.active === true );
      if ( __moneydata.length > 0  ) {
        const __money =  __moneydata[0];
        data['pricePointUp'] = __money.end;
        data['pricePointDown'] = __money.start;
      }
      if ( this.data.hightPeople !== 0 || this.data.lowPeople !== 0 ) {
        let __hightPeople = this.data.hightPeople;
        let __lowPeople = this.data.lowPeople;
        data['peopleNumUp'] = __hightPeople > __lowPeople ? __hightPeople:__lowPeople; 
        data['peopleNumDown'] = __lowPeople < __hightPeople? __lowPeople:__hightPeople;
      }
      const ApiDatas = [
        { key: 'easydata', value: 'amenitiesArray', 'item': 'amenitiesId' },
        { key: 'housetypedata', value: 'housResoTypeArray', 'item': 'pHousResoTypeId' },
        { key: 'unitdata', value: 'houseTypeArray', 'item': 'pHouseTypeId' },
        { key: 'rentdata', value: 'lendTypeArray','item': 'pLendTypeId' },
      ]
      for ( let i = 0; i < ApiDatas.length ; i++ ){
        const __item = ApiDatas[i];
        const __key = __item.key;
        const __data = this.data[ __key ].filter( v => v.active === true );
        if ( __data.length > 0 ) {
          const __k = __item.item;
          const __arr = __data.map( v => { 
            const __v = {};
            __v[__k] = v.code;
            return __v;
          } );
          const __value = __item.value;
          data[ __value ] = JSON.stringify( __arr );
        }
      }
      return data;
    },
    onClickHide() {
      this.setData({
        'show': false,
      })
    },
    __update( $event ) {
      const __detail = $event.detail;
      const { key, list } = __detail;
      if ( key === 'sort') {
        const __list = list.filter( v => v.active === true );
        this.setData({ 
          'sortdata': list,
          'sortTitle': __list.length > 0 ? __list[0].value: sortdata[0].value
        })
      } else if ( key ==='money') {
        this.setData({'moneydata': list });
        this.chooseMoney();
      } else if ( key === 'housetype') {
        this.setData({'housetypedata': list });
      } else if ( key === 'unit') {
        this.setData({'unitdata': list });
      } else if ( key === 'easy') {
        this.setData({'easydata': list });
      } else if ( key === 'rent') {
        this.setData({'rentdata': list })
      }
      if ( key === 'sort') {
        this.update();
      }
    },
    update() {
      const __json = this.filterPamrs();
      this.triggerEvent('update', __json );
      this.checkTips();
      this.setData({ show: false })
    },
    checkTips() {
      const __data = {};

      const __sortdata = this.data.sortdata.filter( v => v.active === true );
      __data['sortTips'] = __sortdata.length > 0 ? true : false;

      const __housetypedata = this.data.housetypedata.filter( v => v.active === true );
      __data['houseTips'] = __housetypedata.length > 0 ? true : false;

      __data['moneyTips'] = this.data.lowMoney || this.data.hightMoney ? true : false;
    
      const __easydata = this.data.easydata.filter( v => v.active === true );
      const __unitdata = this.data.unitdata.filter( v => v.active === true );
      const __rentdata = this.data.rentdata.filter( v => v.active === true );

      if ( __easydata.length === 0 && __unitdata.length === 0 && __rentdata.length === 0 && this.data.curpeople === 0 ) {
        __data['moreTips'] = false;
        __data['moreIndex'] = 0;
      } else {
        let __count = 0;
        if ( __easydata.length > 0 ) {
          __count += 1;
        }
        if ( __unitdata.length > 0 ) {
          __count += 1;
        }
        if ( __rentdata.length  > 0 ) {
          __count += 1;
        }
        if ( this.data.curpeople > 0 ) {
          __count += 1;
        }
        __data['moreTips'] = true;
        __data['moreIndex'] = __count;
      }
      this.setData( __data );
    },
    onChange( $event ) {
      const __detail = $event.detail;
      const { name } = __detail;
      if ( name === this.data.lastType && this.data.show === true ) {
        this.setData({ 
          show: false,
          lastType: '', 
        })
      } else {
        this.setData({ 
          show: true,
          lastType: name,  
        })
      }
    },
    relust( $event ) {
      const __type = $event.target.dataset.type;
      this.update();
    },
    clearType( $event ) {
      const __type = $event.target.dataset.type;
      if ( __type === 'more' ) {
        this.__resetEasy();
      } else if ( __type === 'housetype') {
        this.__resetHoseType();
      } else if ( __type === 'money' ) {
        this.__resetMoney();
      } 
      this.update();
    },
    /* 重新筛选函数 */ 
    __resetHoseType() {
      const __data = this.data.housetypedata.map( v => { v.active = false; return v; }); 
      this.setData({'housetypedata': __data });
    },
    __resetEasy() {
      const unitdata = this.data.unitdata.map( v => { v.active = false; return v; })
      const easydata = this.data.easydata.map( v => { v.active = false; return v; })
      const rentdata = this.data.rentdata.map( v => { v.active = false; return v; })
      this.setData({
        'curpeople': 0,
        'easydata': easydata,
        'unitdata': unitdata,
        'rentdata': rentdata,
        'lowPeople': 0,
        'hightPeople':0,
      })
    },
    __resetMoney() {
      const __data = this.data.moneydata.map( v => { v.active = false; return v; })
      this.setData({
        'hightMoney': 0,
        'lowMoney':0,
        '__hightMoney': 0,
        '__lowMoney':0,
        'moneydata': __data,
      })
    },
    closeOverlay() {
      this.setData({ show: false })
    },
    lowValueChangeAction($event) {
      const { detail } =$event
      const { lowValue } = detail;
      const __index = lowValue >= lowValue.length? moneySlder.length-1 :lowValue;
      this.setData({
        lowMoney: moneySlder[__index]
      })
    },
    heighValueChangeAction($event) {
      const { detail } =$event
      const { heighValue } = detail;
      const __index = heighValue >= moneySlder.length? moneySlder.length-1 : heighValue;
      this.setData({
        hightMoney: moneySlder[__index]
      })
    },
    lowPeopleChangeAction($event) {
      const { detail } =$event
      const { lowValue } = detail;
      this.setData({
        lowPeople: lowValue,
        hightPeople: 0,
      })
    },
    heighPeopleChangeAction($event) {
      const { detail } =$event;
      const { heighValue } = detail;
      this.setData({
        hightPeople: heighValue,
      })
    }
  }
})
