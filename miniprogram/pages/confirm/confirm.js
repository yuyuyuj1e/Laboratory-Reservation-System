// pages/confirm/confirm.js

const db = wx.cloud.database()
const date_util = require('../../utils/getDate.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: "",  // 预约日期
        time: "",  // 预约时间
        user_openid: "",  // 用户ID
        user_info: "",  // 用户信息
        lab_info: "",  // 实验室信息
        lab_id: "",  // 预约实验室ID
        lab_name: "",  // 实验室名称
        building: "",  // 所在教学楼
        laboratory: "",  // 门牌号
        count: 1,  // 预约人数
        tab: 0,  // 预约类型
        show_date: date_util.getDates(2), // 展示日期
        popularity: ""  // 实验室人气
    },

    /**
     * 点击确定按钮
     */
    btnConfirm: function(res) {
        console.log('用户点击预约')

        db.collection('appointment_record').add({  // 添加预约记录
            data: {
                type: this.data.tab,  // 预约类型
                enable: true,  // 是否有效
                status: false,  // 预约状态 是否完成审核 true通过审核 false 未通过审核或者还在审核中
                laboratory_id: this.data.lab_id,  // 实验室ID
                user_id: this.data.user_openid,  // 用户ID
                user_name: this.data.user_info.name,  // 用户姓名
                class: this.data.user_info.class,  // 用户班级
                count: this.data.count,  // 预约人数
                name: this.data.lab_name,  // 实验室名称
                laboratory: this.data.laboratory,  // 门牌号
                building: this.data.building,  // 实验室所在教学楼
                date: this.data.date,  // 预约日期
                time: this.data.time,  // 预约时间
                show_date: this.data.date == '明天' ? this.data.show_date[0] : this.data.show_date[1],  // 展示日期
                _createTime: Date.parse(new Date())  // 创建时间
            },
        }).then(res => {  // 更新实验室状态(可预约人数)
            // 如果是个人预约
            if (this.data.tab == 0) {
                let temp_order = this.data.lab_info.order
                // 更新当前容量
                temp_order[this.data.date][this.data.time].now_count = temp_order[this.data.date][this.data.time].now_count - this.data.count  // 更新当前容量
                // 更新实验室状态
                temp_order[this.data.date][this.data.time].class_status = '不可预约'
                temp_order[this.data.date][this.data.time].private_status = temp_order[this.data.date][this.data.time].now_count == 0 ? '不可预约' : '可预约'
                db.collection('laboratory').doc(this.data.lab_id).update({
                    data: {
                        _updateTime: Date.parse(new Date()),  // 更新修改时间
                        // 更新实验室状态
                        order: temp_order
                    }
                })
            }
            // 如果是班级预约
            else {
                let temp_order = this.data.lab_info.order
                // 更新当前容量
                temp_order[this.data.date][this.data.time].now_count = temp_order[this.data.date][this.data.time].now_count - this.data.count  
                // 更新实验室状态
                temp_order[this.data.date][this.data.time].class_status = '不可预约'
                temp_order[this.data.date][this.data.time].private_status = '不可预约'
                db.collection('laboratory').doc(this.data.lab_id).update({
                    data: {
                        _updateTime: Date.parse(new Date()),  // 更新修改时间
                        // 更新实验室状态
                        order: temp_order
                    }
                })
            }
        }).then(res => {
            console.log(this.data.lab_name + "热度增加" + (this.data.count * 2))
            let new_popularity = this.data.popularity + (this.data.count * 2)
            db.collection('laboratory').doc(this.data.lab_id).update({
                data: {
                    popularity: new_popularity
                }
            })
            wx.showToast({
                title: '预约成功',
                icon: 'success',
                success: setTimeout(res => {
                        wx.navigateBack({
                            delta: 2,
                        })
                }, 1500)
            })
        })
    },

    /**
     * 点击取消按钮
     */
    btnCancel: function(res) {
        console.log('用户点击取消')
        wx.showToast({
            title: '已取消预约',
            icon: 'error',
            success: setTimeout(res => {
                wx.navigateBack({
                    delta: 1,
                })
            }, 1500)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            lab_id: options.lab_id,
            building: options.building,
            laboratory: options.laboratory,
            lab_name: options.lab_name,
            date: options.date,
            time: options.time,
            count: options.count,
            tab: options.tab,
        })
        // 导入个人信息
        let  user_id = getApp().globalData.user_openid
        this.setData({
            user_openid: user_id,
        }) 
        db.collection("user_info").doc(user_id).get().then(res=>{
            this.setData({
                user_info: res.data
            })
        })
        // 导入实验室信息
        db.collection("laboratory").doc(this.data.lab_id).get().then(res=>{
            this.setData({
                lab_info: res.data,
                popularity: res.data.popularity
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