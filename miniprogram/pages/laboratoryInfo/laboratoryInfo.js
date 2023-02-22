// pages/laboratoryInfo/laboratoryInfo.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        laboratory_info: "",  // 实验室信息
        building: ""  // 教学楼名称
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let new_popularity
        db.collection('laboratory').doc(options.laboratory_id).get().then(res => {
            new_popularity = res.data.popularity + 1
            this.setData({
                laboratory_info: res.data
            })
        }).then( res => {
            db.collection('building').doc(this.data.laboratory_info.building).get().then(res => {
                this.setData({
                    building: res.data.building
                })
            })
        }).then(res => {
            db.collection('laboratory').doc(options.laboratory_id).update({
                data: {
                    popularity: new_popularity
                }
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