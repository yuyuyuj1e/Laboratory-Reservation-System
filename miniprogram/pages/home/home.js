// pages/home/home.js

const db = wx.cloud.database()
const user_util = require('../../utils/getUserInfo.js');
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'

Page({
    /**
     * stroe 配置
     */
    behaviors: [storeBindingsBehavior],
    storeBindings: {
        store,
        fields: {
            active: 'activeTabIndex'
        },
        actions: {
            updateActive: 'updateTabBarIndex'
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        swiper_image_list: "",
        swiper_notice_list: "",
        news_list: "",
        // lab_list: "",
        navigation_list: [
            {
                id: "1",
                bg: "linear-gradient(0deg,rgba(9,216,162,1),rgba(90,242,217,1))",
                icon: "../../images/graduation.png",
                text: "在线预约",
                url: "../order/order"
            },
            {
                id: "2",
                bg: "linear-gradient(0deg,rgba(9,177,252,1),rgba(24,200,255,1))",
                icon: "../../images/laboratory_list.png",
                text: "预约查询",
                url: "../my_order/my_order"
            },
            {
                id: "3",
                bg: "linear-gradient(0deg,rgba(251,184,35,1),rgba(255,228,40,1))",
                icon: "../../images/customer_service.png",
                text: "在线客服",
                url: "../contact/contact"
            },
            {
                id: "4",
                bg: "linear-gradient(0deg,rgba(255,126,34,1),rgba(240,184,27,1))",
                icon: "../../images/laboratory.png",
                text: "实验室检索",
                url: "../list/list"
            }
        ],
    },

    /**
     * 点击导航函数
     */
    btnNavBar: function(e) {
        if (e.currentTarget.id == 1) {
            this.updateActive(1)
            wx.switchTab({
                url: this.data.navigation_list[e.currentTarget.id - 1].url,
            })
        }
        else if (e.currentTarget.id == 2 || e.currentTarget.id == 3 || e.currentTarget.id == 4) {
            if(getApp().globalData.user_openid == "") {
                user_util.getUserInfo()
            }
            else {
                wx.navigateTo({
                    url: this.data.navigation_list[e.currentTarget.id - 1].url,
                })
            }
        }
    },

    /**
     * 点击查看更多
     */
    btnLab: function () {
        wx.navigateTo({
          url: '../list/list',
        })
    },

    /**
     * 点击新闻函数
     */
    btnTurnToNews: function(e) {
        if(getApp().globalData.user_openid == "") {
            user_util.getUserInfo()
        }
        else {
            wx.navigateTo({
                url: '../news/news?news_id=' + e.currentTarget.id,
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection("banner").where({ photo: db.command.neq(null) }).get({
            success: (res) => {
                this.setData({
                    swiper_image_list: res.data
                })
            }
        }),
        db.collection("notice").where({ text: db.command.neq(null) }).get({
            success: (res) => {
                this.setData({
                    swiper_notice_list: res.data
                })
            }
        }),
        db.collection("exercise").where({ title: db.command.neq(null) }).get({
            success: (res) => {
                this.setData({
                    news_list: res.data
                })
            }
        })
        // db.collection('laboratory').where({ _id: db.command.neq(null) }).get({
        //     success: (res) => {
        //         this.setData({
        //             lab_list: res.data
        //         })
        //     }
        // })
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
        this.storeBindings.destroyStoreBindings()
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