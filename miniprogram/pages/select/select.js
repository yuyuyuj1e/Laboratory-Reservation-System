// pages/select/select.js

const db = wx.cloud.database();
const util = require('../../utils/getLabInfo.js');
const status_util = require('../../utils/getStatus.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: "",  // 个人预约还是班级预约
        position: "",  // 实验楼
        category: "",  // 类型
        date: "",  // 日期
        time: "",  // 时间
        count: 1,  // 人数
        laboratory_list: [],  // 添加了 实验室类型字段以及教学楼字段的 实验室列表
        appointment_record_list: [],  // 预约列表
        temp: [],  // 添加了 实验室类型字段的 实验室列表
        category_list: [],
        building_list: [],
        status_index: 0,
        status_columns: ['查看全部', '可预约', '不可预约', '已预约'],
    },

    /**
    *  点击状态
    */
    statusChange: function(e) {
        this.setData({
            status_index: e.detail.value
        })
    },

    /**
     * 跳转页面 
     */
    turnToConfirm: function(res) {
        var index = res.currentTarget.id
        // 判断实验室 预约状态
        if (this.data.laboratory_list[index].order[this.data.date][this.data.time].private_status == '不可预约') {
           console.log('该实验室不可预约')
           wx.showToast({
             title: '实验室不可预约',
             icon: 'error'
           })
        } 

        // 已经预约过该实验室 
        else if(this.data.laboratory_list[index].order[this.data.date][this.data.time].private_status == '已预约') {
            console.log('已经预约过该实验室')
            wx.showToast({
                title: '您已预约此实验室',
                icon: 'error'
            })
        }
        // 上述情况都不满足 可以预约 该实验室
        else {
            wx.navigateTo({
                url: '../confirm/confirm?lab_id=' + this.data.laboratory_list[index]._id 
                + '&building=' + this.data.laboratory_list[index].buildingInfo
                + '&lab_name=' + this.data.laboratory_list[index].name
                + '&laboratory=' + this.data.laboratory_list[index].laboratory
                + '&tab=' + this.data.tab
                + '&date=' + this.data.date
                + '&time=' + this.data.time
                + '&count=' + this.data.count,
            })
        }
    },

    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
          title: '数据加载中',
          mask: true,
        })
        // 存储页面参数
        this.setData({
            tab: options.tab,
            position: options.position,
            category: options.category,
            date: options.date,
            time: options.time,
        })
        // 如果是班级预约 需要传入count 如果是个人预约则默认为 1个人
        if (options.tab == 1) {
            this.setData({
                count: options.count
            })
        }


        // 导入预约记录
        db.collection('appointment_record').where({ enable: true }).get().then(res => {
            this.setData({
                appointment_record_list: res.data
            })
        })


        // 找到满足所选 类型和地点 的实验室
        db.collection('laboratory').where({ 
            building: options.position != "0" ? options.position : db.command.neq(null), 
            category: options.category != "0" ? options.category : db.command.neq(null) 
        }).get().then( res => {
            this.setData({
                laboratory_list: res.data
            })
        })
        // 导入实验室类型列表 以及 地点列表
        db.collection('category').where({classification: db.command.neq(null)}).get().then( res => {
            this.setData({
                category_list: res.data,
                temp: util.getCateInfo(this.data.laboratory_list, res.data)
            })
        }).then(res => {
            db.collection('building').where({building: db.command.neq(null)}).get().then( res => {
                this.setData({
                    building_list: res.data,
                })
            }).then(res => {
                this.setData({
                    laboratory_list: util.getBuildInfo(this.data.temp, this.data.building_list)
                })
            })
        }).then( res => {
            wx.hideLoading()
        }).then( res => {  // 修改状态， 添加已预约状态 ！！！！！！！！！！！！！！！！！！！！！！！！！！
            let list = status_util.getStatus(this.data.laboratory_list, this.data.appointment_record_list, this.data.date, this.data.time)
            this.setData({
                laboratory_list: list
            })
        }).then( res => {
            wx.hideLoading()
        })
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let list = status_util.getStatus(this.data.laboratory_list, this.data.appointment_record_list, this.data.date, this.data.time)
        this.setData({
            laboratory_list: list
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})