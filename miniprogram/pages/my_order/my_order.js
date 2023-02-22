// pages/my_order/my_order.js

const db = wx.cloud.database();
const show_record_util = require('../../utils/getShowRecord');
const del_record_util = require('../../utils/delRecord.js');
const cancel_record_util = require('../../utils/cancelRecord.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
		delBtnWidth:180,  // 删除按钮的宽度
        isScroll:true,  // 是否允许滑动
        startX: "",  // 触摸时X的坐标
        appointment_record_list: [],  // 预约列表
        show_list: [],  // 用于展示的列表
        select_list: ['查看全部', '审核中', '个人预约', '班级预约', '失效预约'],
        select_index: 0,
    },

    /**
     * 状态切换
     */
    selectChange: function(e) {
        let new_list = show_record_util.getShowRecodMine(this.data.appointment_record_list, e.detail.value)
        this.setData({
            select_index: e.detail.value,
            show_list: new_list
        })
    },

    /**
     * 取消预约
     */
    delRecord: function(e) {
        let new_list = []  // 新展示的预约列表
        let record_item = this.data.show_list[e.currentTarget.id]  // 被选中的预约记录
        wx.showModal({
            confirmText: '确定',
            cancelText: '取消',
            content: this.data.select_index == 4 ? '请确认删除该记录' : '请确认取消此预约',
            title: this.data.select_index == 4 ? '删除提醒' : '取消提醒',
            success: (res) => {
                // 确认 删除/取消 预约记录
                if (res.confirm) {
                    // 删除失效记录
                    if (this.data.select_index == 4) {
                        console.log('删除失效预约记录')
                        // 删除记录
                        db.collection('appointment_record').doc(record_item._id).remove().then( res => {
                            console.log("删除成功")
                        })
                        // 更新预约记录列表
                        db.collection('appointment_record').where({ user_id: getApp().globalData.user_openid }).get().then(res => {
                            // 给每条记录 添加 right 字段
                            res.data.forEach(item => {
                                item.right = 0
                            })
                            this.setData({
                                appointment_record_list: res.data
                            })
                        })
                        // 更新页面
                        new_list = del_record_util.delDisable(this.data.show_list, e.currentTarget.id)
                        this.setData({
                            show_list: new_list
                        })
                        wx.showToast({
                          title: '删除成功',
                          icon: 'success',
                          duration: 1500
                        })
                    }
                    // 若审核通过，则无法删除，只能联系管理员 进行删除
                    else if (record_item.status) {
                        console.log('预约通过无法删除')
                        wx.showModal({
                            confirmText: '确定',
                            cancelText: '取消',
                            content: '请确联系管理员取消预约',
                            title: '取消提醒',
                        })
                    }
                    // 取消在审核中的预约
                    else {
                        // 更新数据库实验室信息
                        cancel_record_util.cancelRecord(record_item)
                        // 使预约记录变成无效记录
                        db.collection('appointment_record').doc(record_item._id).update({
                            data: {
                                enable: false,  // 使预约失效
                                _updateTime: Date.parse(new Date()),  // 更新修改时间
                            }
                        }).then( res => {
                            console.log("取消成功")
                        })
                        // 更新预约记录列表
                        db.collection('appointment_record').where({ user_id: getApp().globalData.user_openid }).get().then(res => {
                            // 给每条记录 添加 right 字段
                            res.data.forEach(item => {
                                item.right = 0
                            })
                            this.setData({
                                appointment_record_list: res.data
                            })
                        })
                        // 更新页面
                        new_list = del_record_util.delEnable(this.data.show_list, e.currentTarget.id)
                        this.setData({
                            show_list: new_list
                        })
                    }
                }
            },
        })
        
    },

    /**
	 * 滑动开始时的初始设置
	 */
    touchStart: function(e) {
        console.log('开始滑动')
        let touch = e.touches[0]  // 获取触摸信息

        // 初始化右侧位置，每次滑动时默认删除还未出现
		for(let i in this.data.show_list) {
			let item = this.data.show_list[i]
			item.right = 0
        }
        this.setData({
            startX: touch.clientX,   // touch.clientX 触摸时起始X坐标
            show_list: this.data.show_list
        })
    },


    /**
	 * 滑动过程中
	 */
    touchMove: function(e) {
        let touch = e.touches[0]  // 获取触摸信息
		let distanceX = this.data.startX - touch.clientX  // 计算滑动距离
        let item = this.data.show_list[e.currentTarget.id]  // 被点击的项目
        // console.log(distanceX)
        // 当滑动距离超过 20 时
		if (distanceX >= 20) {
			// 限制滑动距离，当滑动距离大于所设置的删除按钮宽度时，阻止滑动
			if (distanceX > this.data.delBtnWidth) {
				distanceX = this.data.delBtnWidth
            }
            // 设置滑动距离
            item.right = distanceX
			this.setData({
				isScroll: false,
				show_list: this.data.show_list
			})
		} 
		else {
            // 设置滑动距离
            item.right = 0
			this.setData({
				isScroll: true,
				show_list: this.data.show_list
			})
		}
    },


    /**
	 * 滑动结束
	 */
    touchEnd: function(e) {
        console.log('滑动结束')
        let item = this.data.show_list[e.currentTarget.id]  // 被点击的项目
        // 当滑动距离超过删除按钮宽度的 1/2 时释放滑动 被视为滑动成功，显示删除按钮
		if (item.right >= this.data.delBtnWidth/2) {
            // 设置滑动距离
            item.right = this.data.delBtnWidth
			this.setData({
				isScroll: true,
				show_list: this.data.show_list
			})
		} 
		// 不超过1/2时，被视为滑动失效，退回
		else {
            // 设置滑动距离
            item.right = 0
			this.setData({
				isScroll: true,
				show_list: this.data.show_list
			})
		}
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user_id = getApp().globalData.user_openid
        // 获取预约记录列表
        db.collection('appointment_record').where({ user_id: user_id }).get().then(res => {
            // 给每条记录 添加 right 字段
            res.data.forEach(item => {
                item.right = 0
            })
            let new_list = show_record_util.getShowRecodMine(res.data, 0)
            this.setData({
                appointment_record_list: res.data,
                show_list: new_list
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