// pages/order/order.js

const db = wx.cloud.database();
const date_util = require('../../utils/getDate.js');
const user_util = require('../../utils/getUserInfo.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_info: "",  // 用户信息
        user_list: "",  // 用户列表
        tab: 0,  // 默认激活项 0 为个人预约  1 为班级预约
        class_count: 1,  // 班级人数
        building_list: [],  // 数据库中的 教学楼 列表
        building_info: [  // 添加 查看全部
            {
                "id": "0",
                "building": "查看全部",
                "_id": "0"
            }
        ],
        time_list: ['08:00 ~ 12:00', '14:00 ~ 17:30'],
        category_list: [],  // 数据库中的 实验室类型 列表
        category_info: [  // 添加 查看全部
            {
                "id": "0",
                "classification": "查看全部",
                "_id": "0"
            }
        ],
        date_list: ['明天', '后天'],  // 预约日期
        building_index: 0,
        category_index: 0,
        time_index: 0,
        date_index: 0,
    },

    /** 
    * 切换预约类型
    */
    tabChange: function(res) {
        this.setData({
            tab: res.currentTarget.id,
        })
    },

    /**
     * 选择器状态切换
     */
    buildChange: function(e) {
        this.setData({
            building_index: e.detail.value
        })
    },

    categoryChange: function(e) {
        this.setData({
            category_index: e.detail.value
        })
    },

    dateChange: function(e) {
        this.setData({
            date_index: e.detail.value
        })
    },

    timeChange: function(e) {
        this.setData({
            time_index: e.detail.value
        })
    },

    numChange: function(e) {
        this.setData({
            class_count: e.detail
        })
    },

    /**
     * 跳转页面
     */
    btnToSelect: function(res) {
        // 更新用户信息
        if (getApp().globalData.user_openid != "") {
            db.collection('user_info').doc(getApp().globalData.user_openid).get().then(res => {
                this.setData({
                    user_info: res.data
                })
            })
        }
        // 判断用户是否拥有预约资格
        if(getApp().globalData.user_openid == "") {
            wx.showToast({
              title: '请先登录',
              icon: 'error',
              duration: 1000
            })
            user_util.getUserInfo()
        }
        else if (!this.isUser(this.data.user_list, getApp().globalData.user_openid)) {
            wx.showModal({
                confirmText: '确定',
                cancelText: '取消',
                content: '您未被录入使用名单，请确联系管理员添加',
                title: '警告',
            })
        }
        else if (!this.data.user_info.order) {
            wx.showModal({
                confirmText: '确定',
                cancelText: '取消',
                content: '您没有预约权限，请确联系管理员',
                title: '警告',
            })
        }
        else {
            wx.navigateTo({
                url: this.data.tab == 0 ? 
                  '../select/select?tab=' + this.data.tab 
                  + '&position=' + this.data.building_info[this.data.building_index]._id 
                  + '&category=' + this.data.category_info[this.data.category_index]._id 
                  + '&date=' + this.data.date_list[this.data.date_index]
                  + '&time=' + this.data.time_index :
                  '../cselect/cselect?tab=' + this.data.tab 
                  + '&position=' + this.data.building_info[this.data.building_index]._id 
                  + '&category=' + this.data.category_info[this.data.category_index]._id 
                  + '&date=' + this.data.date_list[this.data.date_index] 
                  + '&time=' + this.data.time_index
                  + '&count=' + this.data.class_count
            })
        }
        
    },

    isUser: function (user_list, userID) {
        for (let i = 0; user_list[i] != null; i++) {
            if (user_list[i].user_id == userID) {
                return true
            }
        }
        return false
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 加载教学楼列表
        db.collection('building').where({ id: db.command.neq(null) }).get().then(res => {
            var date = date_util.getDates(2);
            var building_list=['查看全部']
            this.setData({
                building_info: this.data.building_info.concat(res.data)
            })
            for(var i = 1; i <= res.data.length; i++) {
                building_list.push(this.data.building_info[i].building)
            } 
            this.setData({
                building_list: building_list,
                date: date
            })
        })
        // 加载实验室类型列表
        db.collection('category').where({ id: db.command.neq(null) }).get().then(res => {
            var category_list=['查看全部']
            this.setData({
                category_info: this.data.category_info.concat(res.data)
            })
            for(var i = 1; i <= res.data.length; i++) {
                category_list.push(this.data.category_info[i].classification)
            } 
            this.setData({
                category_list: category_list
            })
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
        // 加载用户列表
        db.collection('user_list').where({ user_id: db.command.neq(null) }).get().then( res => {
            this.setData({
                user_list: res.data
            })
        })
        // 加载用户信息
        if (getApp().globalData.user_openid != "") {
            db.collection('user_info').doc(getApp().globalData.user_openid).get().then(res => {
                this.setData({
                    user_info: res.data
                })
            })
        }
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