// components/list-button/index.js
Component({
  options:{
    multipleSlots: true
  },
  properties: {
    list: {
      type: Array,
      value: [],
    },
    type: {
      type: String,
      value:'single' // 单选:single or 多选：multiple
    },
    __class: {
      type: String,
      value: 'button',
    },
    key: {
      type: String,
      value: '',
    }
  },
  methods: {
    choose( $event ) {
      const index = $event.currentTarget.dataset.index;
      const __data = [...  this.data.list ];
      if ( this.data.type === 'single' ) {
        const __list = __data.map((v, i) => {
          v['active'] = i === index ? true : false;
          return v;
        })
        this.setData({ list: __list})
      } else {
        const __item = __data[index];
        const __active = __item['active'] ;
        __item['active'] = !__active;
        __data[index] = __item;
        this.setData({'list': __data})
      }
      this.update();
    },
    update() {
      this.triggerEvent('update', {
        key: this.data.key,
        list: this.data.list,
      } )
    }
  }
})
