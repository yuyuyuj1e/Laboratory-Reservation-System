// pages/administration/administration.js

const db = wx.cloud.database()
const show_record_util = require('../../utils/getShowRecord');
const cancel_record_util = require('../../utils/cancelRecord.js');
const new_list_util = require('../../utils/getNextDayList');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        select_index: 0,
        select_list: ['查看全部', '审核中', '已通过'],
        record_list: [],  // 预约列表
        show_list: [],  // 展示列表

        lab_list: "",  // 实验室列表
        record_list: ""  // 预约记录列表
    },

    /**
     * 状态切换
     */
    selectChange: function (e) {
        let temp_list = []
        // 更新列表
        db.collection('appointment_record').where({ enable: true }).get().then( res => {
            this.setData({
                record_list: res.data
            })
        }).then( res => {
            temp_list = show_record_util.getShowRecodAdminstration(this.data.record_list, e.detail.value)
            this.setData({
                select_index: e.detail.value,
                show_list: temp_list
            })
        })    
    },

    /**
     * 同意按钮
     */
    btnPermit: function (e) {
        let temp_item = this.data.show_list
        db.collection('appointment_record').doc(temp_item[e.currentTarget.id]._id).update({
            data: {
                _updateTime: Date.parse(new Date()),  // 更新修改时间
                status: true,
                enable: true
            }
        }).then(res => {
            // 更新页面信息
            temp_item[e.currentTarget.id].status = true,
            temp_item[e.currentTarget.id].enable = true
            this.setData({
                show_list: temp_item
            })
            console.log("同意预约")
        })
    },

    /**
     * 拒绝按钮
     */
    btnRefuse: function (e) {
        let temp_item = this.data.show_list
        db.collection('appointment_record').doc(temp_item[e.currentTarget.id]._id).update({
            data: {
                _updateTime: Date.parse(new Date()),  // 更新修改时间
                status: false,
                enable: false
            }
        }).then(res => {
            // 更新数据库信息
            cancel_record_util.cancelRecord(temp_item[e.currentTarget.id])
            // 更新页面信息
            temp_item[e.currentTarget.id].status = false,
            temp_item[e.currentTarget.id].enable = false
            this.setData({
                show_list: temp_item
            })
            console.log("拒绝预约")
        })
    },

    /**
     * 取消按钮
     */
    btnCancel: function (e) {
        let temp_item = this.data.show_list
        db.collection('appointment_record').doc(temp_item[e.currentTarget.id]._id).update({
            data: {
                _updateTime: Date.parse(new Date()),  // 更新修改时间
                status: true,
                enable: false
            }
        }).then(res => {
            // 更新数据库信息
            cancel_record_util.cancelRecord(temp_item[e.currentTarget.id])
            // 更新页面信息
            temp_item[e.currentTarget.id].status = true,
            temp_item[e.currentTarget.id].enable = false
            this.setData({
                show_list: temp_item
            })
            console.log("取消预约")
        })
    },

    /**
     * 模拟到下一天
     */
    btnNextDay: function () {
        console.log('模拟到下一天')
        // 更新实验室列表
        db.collection('laboratory').where({ _id: db.command.neq(null) }).get().then(res => {
            this.setData({
                lab_list: res.data
            })
        }).then(res => {
            let new_list = new_list_util.getNextDayLabList(this.data.lab_list)
            for (let i in new_list) {
                db.collection('laboratory').doc(new_list[i]._id).update({
                    data: {
                        order: new_list[i].order
                    }
                })
            }
        })
        // 更新预约记录列表
        db.collection('appointment_record').where({ enable: true }).get().then(res => {
            this.setData({
                record_list: res.data
            })
        }).then(res => {
            let new_list = new_list_util.getNextDayRecordList(this.data.record_list)
            for (let i in new_list) {
                db.collection('appointment_record').doc(new_list[i]._id).update({
                    data: {
                        date: new_list[i].date,
                        enable: new_list[i].enable
                    }
                })
            }
        }).then( res => {
            console.log("成功模拟到第二天")
            wx.showToast({
                title: '模拟第二天成功',
                icon: 'success',
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
        db.collection('appointment_record').where({ enable: true }).get().then( res => {
            this.setData({
                show_list: res.data,
                record_list: res.data
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