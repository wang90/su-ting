// components/map-card/index.js
Component({
  properties: {
    latitude: {
      type: String,
      value: 39.918056,
    },
    longitude: {
      type: String,
      value: 116.397027
    },
    title: {
      type: String,
      value: '',
    }
  },
  data: {
		setting: { // 使用setting配置，方便统一还原
			rotate: 0,
			skew: 0,
			enableRotate: true,
		},
		scale: 15,
		isOverLooking: false,
		isGuGong: true,
		is3D: true,
		minScale: 3,
		maxScale: 20,
  },
  methods: {
    toMap() {
      try {
        const latitude = Number(this.data.latitude);
        const longitude = Number(this.data.longitude);
        wx.openLocation({
          latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: longitude, // 经度，浮点数，范围为1  80 ~ -
          name: this.data.title
        });
      }catch( err) {
        wx.showToast({
          title: err,
          icon: 'error',
          duration: 2000
        });
      }
      
    }
  }
})
