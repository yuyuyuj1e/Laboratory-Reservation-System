// pages/alterInfo/alterInfo.js

const db = wx.cloud.database();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_openid: "",
        user_info: "",
        gender: ['男', '女', '保密'],
        gender_index: 0,
    },

    birChange:function(e) {
        console.log(e.detail.value)
        var birth = "user_info.date_of_birth"
        this.setData({
            [birth]: e.detail.value
        })
    },

    genChange: function(e) {
        console.log(e)
        var gen = "user_info.gender"
        this.setData({
            gender_index: e.detail.value,
            [gen]: e.detail.value == 0 ? '男' : e.detail.value == 1 ? '女' : '保密'
        })
    },


    /**
     * 点击提交按钮
     */
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var regPhone = /^1[3578]\d{9}$/;
        var regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
        var user_id = getApp().globalData.user_openid

        // 验证手机号，如果错误则返回
        if (!regPhone.test(e.detail.value.tel)) { 
            wx.showModal({
              title: '提示',
              content: '您输入的手机号有误!',
            })
            return false
        } 
        // 验证邮箱，如果错误则返回
        if (!regEmail.test(e.detail.value.email)) { 
            wx.showModal({
              title: '提示',
              content: '您输入的邮箱有误!',
            })
            return false
        } 

        db.collection("user_info").doc(user_id).update({
            // data 传入需要局部更新的数据
            data: {
                _updateTime: Date.parse(new Date()),  // 更新修改时间
                name: e.detail.value.name,
                gender: this.data.user_info.gender,
                date_of_birth: this.data.user_info.date_of_birth,
                university: e.detail.value.university,
                academy: e.detail.value.academy,
                class: e.detail.value.class,
                email: e.detail.value.email,
                tel: e.detail.value.tel,
                address: e.detail.value.address,
                alter: false,  // 关闭修改权限
            }
        }).then( res => {
            console.log("信息修改成功")
            wx.showToast({
                title: '信息修改成功',
                icon: 'success',
                duration: 1500,
                success: setTimeout(res => {
                    wx.switchTab({
                      url: '../mine/mine',
                    })
                }, 1500)
            })
        }).catch( res => {
           console.log("信息修改失败")
           wx.showToast({
            title: '信息修改失败',
            icon: 'error',
            duration: 1500,
            success: setTimeout(res => {
                wx.switchTab({
                  url: '../mine/mine',
                })
            }, 1500)
        })
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 导入个人信息
        var  user_id = getApp().globalData.user_openid
        this.setData({
            user_openid: user_id,
        }) 
        db.collection("user_info").doc(user_id).get().then(res=>{
            this.setData({
                user_info: res.data
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