// pages/list/list.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        category_list: [
            {
            "id": 9,
            "classification": "查看全部"
            }
        ], // 实验室分类
        active_index: 0,  // 激活索引
        laboratory_list: "",  // 对应类型 实验室列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取并设置实验室分类
        db.collection('category').where({ classification: db.command.neq(null) }).get().then(res => {
            this.setData({
                category_list: this.data.category_list.concat(res.data),
            })
            // 获取实验室列表 (默认0被选中)
            db.collection('laboratory').where({ category: db.command.neq(null) }).get().then(res => {
                this.setData({
                    laboratory_list: res.data,
                })
            })
        })
    },

    /**
     * 动态渲染函数
     */
    activeChange: function (res) {
        console.log("分类索引" + res.currentTarget.id + "被点击")
        this.setData({
            active_index: res.currentTarget.id
        })
        // 重新获取实验室列表信息
        this.laboratorChange()
    },


    /** 
    * 重新获取实验室列表信息
    */
    laboratorChange: function() {
        // 如果 id 不为 0 即找到实验室类型库相应类型的 _id 再去实验室列表中查询对应实验室列表
        db.collection('category').where({ id: this.data.active_index }).get().then(res => {
            db.collection('laboratory').where({ category: res.data[0]._id }).get().then(res => {
                this.setData({
                    laboratory_list: res.data,
                })
            })
        }).catch(res => {  // 如果 id 为 0 即找到实验室类型库相应类型的 _id 直接将所有实验室列表找到
            db.collection('laboratory').where({ category: db.command.neq(null) }).get().then(res => {
                this.setData({
                    laboratory_list: res.data,
                })
            })
        })
    },

    btnLaboratoryInfo: function(res) {
        console.log("选择实验室id为: " + res.currentTarget.id)
        wx.navigateTo({
          url: '../laboratoryInfo/laboratoryInfo?laboratory_id=' + res.currentTarget.id,
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