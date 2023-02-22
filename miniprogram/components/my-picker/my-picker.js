// components/my-picker/my-picker.js
Component({
  behaviors: ['wx://form-field'],
  properties: {
    //选项
    picker: {
      type: Array,
      value: ['未设置数据'],
    },
    //默认选中值
    value: {
      type: String,
      value: '未设置数据'
    },
    //选项卡类型
    type: {
      type: String,
      value: 'normal'
    },
    //箭头方向
    arrowdirection: {
      type: String,
      value: ''
    },
    //如果是多级选择，选项值的格式
    pickers: {
      type: Object,
      value: {
        浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        福建: ['福州', '厦门', '莆田', '三明', '泉州'],
      }
    }
  },
  data: {
    //起始选择日期
    minDate: new Date(2019, 0, 1).getTime(),
    //当前日期
    currentDate: new Date().getTime(),
    //默认选择时间
    currentTime: '12:00',
    //多级选择的数据预留
    columns: [],
  },
  methods: {
    //展示弹窗
    showPopup(e) {
      this.setData({
        show: true
      });
    },
    //隐藏弹窗
    onClose() {
      this.setData({
        show: false
      });
    },
    //监听选项值数据改变
    onChange(event) {
      let data = event.detail.value
      this.setData({
        value: data
      })
      this.triggerEvent("change", {
        data
      })
    },
    //多级选择时，监听数据改变
    onChanges(event) {
      let data = event.detail.value
      this.setData({
        value: data
      })
      event.detail.picker.setColumnValues(1, this.data.pickers[event.detail.value[0]]);
      this.triggerEvent("change", {
        data
      })
    },
    //点击确认按钮
    onConfirm(event) {
      let data = event.detail.value
      this.setData({
        value: data,
        show: false
      })
      this.triggerEvent("change", {
        data
      })
    },
    //当类型为日期选择时的监听数据变化
    onInput(event) {
      let data = util.formatDate(new Date(event.detail))
      this.setData({
        value: data,
      });
      this.triggerEvent("change", {
        data
      })
    },
    //当类型为时间选择时的监听数据变化
    onInputTime(event) {
      let data = event.detail
      this.setData({
        value: data,
      });
      this.triggerEvent("change", {
        data
      })
    },
 
  },
  lifetimes: {
    //组件创建时响应函数
    attached: function () {
      if (this.data.type == 'MultiPicker') {
        //多级数据格式化
        var co = [{
            values: Object.keys(this.data.pickers),
            className: 'column1',
          },
          {
            values: this.data.pickers[Object.keys(this.data.pickers)[0]],
            className: 'column2',
          }
        ]
        this.setData({
          columns: co
        })
      }
    },
  },
})