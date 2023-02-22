// pages/feedback/feedback.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        contact: '',
        contant: ''
    },
    
    formSubmit: function (e) {
        var content = e.detail.value.opinion;
        var contact = e.detail.value.contact;
        var regPhone = /^1[3578]\d{9}$/;
        var regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
        // 反馈内容
        if (content == "") {
          wx.showModal({
            title: '提示',
            content: '反馈内容不能为空!',
          })
          return false
        }
        // 联系方式
        if (contact == "") {
          wx.showModal({
            title: '提示',
            content: '手机号或者邮箱不能为空!',
          })
          return false
        }
        // 验证手机号或者邮箱
        if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { 
          wx.showModal({
            title: '提示',
            content: '您输入的手机号或者邮箱有误!',
          })
          return false
        } 
        else {
            this.setData({
                loading: true
            })

            // 获取用户使用环境
            var model, system, platform;
            wx.getSystemInfo({
                success: function (res) {
                    model = res.model;
                    system = res.system;
                    platform = res.platform;
                }
            })

            db.collection("feedback").add({
                data: {
                    _createTime: Date.parse(new Date()),  // 创建时间
                    content: content,
                    contact: contact,
                    model: model, //手机型号
                    system : system, //操作系统版本
                    platform: platform  //客户端平台
                    }
            }).then( res => {
                this.setData({
                    loading: false,
                    contact: '',
                    contant: ''
                })

                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1500,
                  success: setTimeout(res => {
                    wx.switchTab({
                      url: '../mine/mine',
                    })
                  }, 1500)
                })
                
            }).catch(res => {
                this.setData({
                  loading: false
                })
                wx.showToast({
                  title: '提交失败',
                  icon: 'error',
                  duration: 1500,
                  success: setTimeout(res => {
                    wx.switchTab({
                      url: '../mine/mine',
                    })
                  }, 1500)
                })
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