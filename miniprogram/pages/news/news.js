// pages/news/news.js

const db = wx.cloud.database()
const date_util = require('../../utils/getDate.js');
const sort_util = require('../../utils/quickSort.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        news_id: "",
        news: "",
        lab_info: "",
        comment_list: "",
        user_info: "",
        show: false,  // 弹出层
        tabType: 'tab1',
		key: 'tab1',
		conditionList: [
            {
				title: '默认排序',
				id: '1',
				select: true
			},
			{
				title: '热门排序',
				id: '2',
				select: false
			},
			{
				title: '最新排序',
				id: '3',
				select: false
			}
		],
		choosedCondition: {
			title: '默认排序',
			id: '1'
		},
		conditionVisible: false,
    },
    
    /**
     * 跳转实验室
     */
    btnLaboratoryInfo: function(res) {
        wx.navigateTo({
          url: '../laboratoryInfo/laboratoryInfo?laboratory_id=' + this.data.lab_info._id,
        })
    },

    /**
     * 点赞
     */
    changeCount: function(option) {
        console.log(option.currentTarget.id)
        let temp = "comment_list[" + option.currentTarget.id + "].count"
        this.setData({
            [temp]: this.data.comment_list[option.currentTarget.id].count + 1
        })

        db.collection('comment').doc(this.data.comment_list[option.currentTarget.id]._id).update({
            data: {
                count: this.data.comment_list[option.currentTarget.id].count,
                _updateTime: Date.parse(new Date())
            }
        })
    },

    /**
     * 发表评论，弹出弹出层
     */
    publishComment: function () {
        this.setData({
            show: true
        })
    },

    /**
     * 提交评论
     */
    formSubmit: function (e) {
        if (e.detail.value.comment == "") {
            console.log("内容不能为空")
            wx.showToast({
              title: '内容不能为空',
              icon: 'none',
              duration: 2000
            })
        }
        else {
            db.collection('comment').add({
                data: {
                    _createTime: Date.parse(new Date()),
                    user_id: this.data.user_info._id,
                    exercise_id: this.data.news_id,
                    content: e.detail.value.comment,
                    count: 0,
                    time: date_util.formatTime(new Date()),
                    user_name: this.data.user_info.nickname,
                    user_img: this.data.user_info.logo
                }
            }).then(res => {
                wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 2000
                })
                this.setData({
                    show: false
                })
            }).then(res => {
                this.refresh()
            })
        }
    },

    /**
     * 退出弹出层
     */
    btnExit: function () {
        this.setData({
            show: false
        })
    },

    refresh: function () {
        db.collection('comment').where({ exercise_id: db.command.eq(this.data.news_id) }).get().then((res) => {
            this.setData({
                comment_list: res.data,
            })

            const list = this.data.conditionList
            list.forEach(item => {
                if (item.id === "1") {
                    item.select = true
                    this.setData({
                        'choosedCondition.title': item.title,
                        'choosedCondition.id': item.id
                    })
                } else {
                    item.select = false
                }
            })
            this.setData({
                conditionList: list
            })
        })  
    },

    showCondition() {
		this.setData({
			conditionVisible: !this.data.conditionVisible
		})
    },
    
	// 改变查询项
	onChnageCondition(e) {
		const list = this.data.conditionList
		list.forEach(item => {
			if (item.id === e.currentTarget.dataset.id) {
				item.select = true
				this.setData({
					'choosedCondition.title': item.title,
					'choosedCondition.id': item.id
				})
			} else {
				item.select = false
			}
		})
		this.setData({
			conditionList: list
        })

        if (e.currentTarget.dataset.id == 1) {
            console.log("默认排序")
            this.refresh()
        }
        else if (e.currentTarget.dataset.id == 2) {
            console.log("热门排序")
            this.setData({
                comment_list: sort_util.quickSortCommentP(this.data.comment_list)
            })
        }
        else {
            console.log("最新排序")
            this.setData({
                comment_list: sort_util.quickSortCommentN(this.data.comment_list)
            })
        }
    },
    
    /**
     * 删除评论
     */
    delComment: function(e) {
        db.collection('comment').doc(this.data.comment_list[e.currentTarget.id]._id).remove().then(res => {
            console.log("删除评论")
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
            })
        }).then(res => {
            this.refresh()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            news_id: options.news_id
        })
        db.collection('exercise').doc(this.data.news_id).get().then( (res) => {
            this.setData({
                news: res.data
            })
        }).then(res => {
            db.collection('laboratory').doc(this.data.news.lab_info).get().then( (res) => {
                this.setData({
                    lab_info: res.data
                })
            })
        }).then(res => {
            db.collection('comment').where({ exercise_id: db.command.eq(options.news_id) }).get().then((res) => {
                this.setData({
                    comment_list: res.data
                })
            })
        }).then(res => {
            db.collection('user_info').doc(getApp().globalData.user_openid).get().then(res => {
                this.setData({
                    user_info: res.data
                })
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