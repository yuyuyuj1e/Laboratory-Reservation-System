// pages/about/about.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: "",  // 详情
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      db.collection('about').doc('807102f662354a43007cdd8b2515ed2a').get().then(res => {
        this.setData({
          detail: res.data
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