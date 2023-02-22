// pages/rank/rank.js

const db = wx.cloud.database();
const date_util = require('../../utils/getDate.js');
const sort_util = require('../../utils/quickSort.js');
const user_util = require('../../utils/getUserInfo.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lab_list: [],  // 实验室列表
        time: "",  // 当前时间
    },

    tLab: function (res) {
        if(getApp().globalData.user_openid == "") {
            user_util.getUserInfo()
        }
        else {
            wx.navigateTo({
                url: '../laboratoryInfo/laboratoryInfo?laboratory_id=' + this.data.lab_list[parseInt(res.currentTarget.id)]._id,
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        db.collection('laboratory').where({ _id: db.command.neq(null) }).get().then(res => {
            var date = date_util.formatTime(new Date());
            this.setData({
                lab_list: sort_util.quickSortLab(res.data),
                time: date
            })
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