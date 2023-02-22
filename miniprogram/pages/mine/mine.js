// pages/mine/mine.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        openID: "",
        avatarUrl: "",
        nickName: "",
        nav_list: [
            {
                id: "1",
                icon: "../../images/user/order.png",
                text: "我的预约",
                url: "../my_order/my_order"
            },
            {
                id: "2",
                icon: "../../images/user/schedule.png",
                text: "个人资料",
                url: "../userInfo/userInfo"
            },
            {
                id: "3",
                icon: "../../images/user/feedback.png",
                text: "意见反馈",
                url: "../feedback/feedback"
            }
        ],
        list1_list: [
            {
                id: "1",
                icon: "../../images/user/sever/info.png",
                text: "产品说明",
                url: "../regulation/regulation"
            },
            {
                id: "2",
                icon: "../../images/user/sever/kefu.png",
                text: "在线客服",
                url: "../contact/contact"
            }
        ],
        list2_list: [
            {
                id: "3",
                icon: "../../images/user/sever/about.png",
                text: "关于系统",
                url: "../about/about"
            },
            {
                id: "4",
                icon: "../../images/user/sever/security.png",
                text: "退出登录",
            }
        ],
        administration: [
            {
                id: "5",
                icon: "../../images/user/sever/administration.png",
                text: "预约管理",
                url: "../administration/administration"
            },
            {
                id: "6",
                icon: "../../images/user/sever/user.png",
                text: "用户管理",
                url: "../userAdmin/userAdmin"
            }
        ],
        isAdministration: false
    },

    /**
     * 获取用户信息——获取openID、用户头像和昵称
     */
    getUserInfo: function() {
        // 获取用户信息
        wx.getUserProfile ({
            desc: '请求获取用户信息',
            success: (res_userinfo) => {
                console.log("用户同意获取信息"),
                // 获取用户头像 昵称
                this.setData({
                    avatarUrl: res_userinfo.userInfo.avatarUrl,
                    nickName: res_userinfo.userInfo.nickName
                }),
                // 获取用户openid
                wx.cloud.callFunction({
                    name: 'getOpenID',
                    success:(res_openid)=> {
                        this.setData({
                            openID: res_openid.result.openid,
                        })
                        getApp().globalData.user_openid = res_openid.result.openid  // 将openid放入到全局变量中
                        console.log("成功获取用户openid：" + res_openid.result.openid)
                        // 判断当前用户是否是曾经登录过的用户  如果是 当如用户信息  如果不是 新建用户信息  
                        db.collection("user_info").doc(res_openid.result.openid).get().then( result => {
                            console.log("用户信息已存在")
                            // 查看是否为管理员
                            this.setData({
                                isAdministration: result.data.administrator
                            })
                            db.collection("user_info").doc(res_openid.result.openid).update({
                                data: {
                                    nickname: res_userinfo.userInfo.nickName,
                                    logo: res_userinfo.userInfo.avatarUrl,
                                    _updateTime: Date.parse(new Date())
                                }
                            }).then( res => {
                                console.log("用户头像昵称更新成功")
                            }).catch( res => {
                                console.log("用户头像昵称更新失败")
                            })
                        }).catch( result => {
                            console.log("数据库中没有此用户信息")
                            db.collection("user_info").add({
                                // data 字段表示需新增的 JSON 数据
                                data: {
                                    _id: res_openid.result.openid, // 可选自定义 _id
                                    _createTime: Date.parse(new Date()),  // 创建时间
                                    gender: "保密",
                                    date_of_birth: "2020-01-01",
                                    nickname: res_userinfo.userInfo.nickName,
                                    logo: res_userinfo.userInfo.avatarUrl,
                                    alter: true,  // 修改权限，新用户第一次被录入后不可以直接修改
                                },
                                success: function() {
                                    console.log("新建用户信息成功")
                                },
                                fail: function() {
                                    console.log("新建用户信息失败")
                                }
                            })
                        })
                 
                    },
                    fail(res) {
                      console.log("openid获取失败", res);
                    }
                })
            },
            fail: (res) => {
                console.log("用户拒绝获取信息")
            }
        })
    },

    /**
     * 跳转函数
     */
    btnNav: function(e) {
        if(getApp().globalData.user_openid == "") {
            this.getUserInfo()
        }
        else {
            wx.navigateTo({
                url: this.data.nav_list[e.currentTarget.id - 1].url,
            })
        }
    },

    btnList: function(e) {
        console.log(e.currentTarget.id)
        if(e.currentTarget.id == 1 || e.currentTarget.id == 2 || e.currentTarget.id == 4) {
            if(getApp().globalData.user_openid == "") {
                this.getUserInfo()
            }
            else {
                if(e.currentTarget.id == 1 || e.currentTarget.id == 2) {
                    wx.navigateTo({
                        url: this.data.list1_list[e.currentTarget.id - 1].url,
                    })
                } else {
                    console.log("退出登录")
                    getApp().globalData.user_openid = "",
                    this.setData({
                        openID: "",
                        users: "",
                        isAdministration: false
                    }),
                    wx.switchTab({
                      url: '../mine/mine',
                    })
                }
            }
            
        }
        else if(e.currentTarget.id == 3) {
            wx.navigateTo({
                url: this.data.list2_list[e.currentTarget.id - 3].url,
            })
        }
        else if(e.currentTarget.id == 5 || e.currentTarget.id == 6) {
            wx.navigateTo({
              url: this.data.administration[e.currentTarget.id - 5].url,
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
        // 导入个人信息
        if(getApp().globalData.user_openid != "") {     
            let  user_id = getApp().globalData.user_openid
            db.collection("user_info").doc(user_id).get().then(res=>{
                console.log(res)
                this.setData({
                    nickName: res.data.nickname,
                    avatarUrl: res.data.logo,
                    openID: user_id,
                    isAdministration: res.data.administrator
                })
            })
        }
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