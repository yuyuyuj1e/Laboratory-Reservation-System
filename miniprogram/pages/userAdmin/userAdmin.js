// pages/userAdmin/userAdmin.js

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_list: []
    },

    /**
     * 权限选择
     */
    alterChange: function (e) {
        db.collection('user_info').doc(this.data.user_list[e.currentTarget.id]._id).update({
            data: {
                _updateTime: Date.parse(new Date()),  // 更新修改时间
                alter: e.detail.value,  // 修改权限
            }
        }).then(res => {
            console.log('权限修改成功')
        })
    },

    orderChange: function (e) {
        // 如果没有学号 代表还没有录入到可预约列表中
        if (this.data.user_list[e.currentTarget.id].student_number == null || this.data.user_list[e.currentTarget.id].student_number == "") {
            wx.showModal({
                confirmText: '确定',
                cancelText: '取消',
                editable: true,
                placeholderText: '请输入学号',
                title: '添加许可',
            }).then(res => {
                if (res.confirm) {
                    console.log(res.content)
                    db.collection('user_list').add({
                        data: {
                            _createTime: Date.parse(new Date()),  // 创建时间
                            user_id: this.data.user_list[e.currentTarget.id]._id
                        }
                    }).then(res=>{
                        console.log('用户添加成功')
                    })
                    db.collection('user_info').doc(this.data.user_list[e.currentTarget.id]._id).update({
                        data: {
                            _updateTime: Date.parse(new Date()),  // 更新修改时间
                            order: e.detail.value,  // 修改权限
                            alter: true,  // 修改权限
                            student_number: res.content
                        }
                    }).then(res => {
                        console.log('权限修改成功')
                        db.collection('user_info').where({ _id: db.command.neq(null) }).get().then(res => {
                            this.setData({
                                user_list: res.data
                            })
                        })
                    })
                }
            })
        }
        // 如果有学号
        else {
            db.collection('user_info').doc(this.data.user_list[e.currentTarget.id]._id).update({
                data: {
                    _updateTime: Date.parse(new Date()),  // 更新修改时间
                    order: e.detail.value,  // 修改权限
                }
            }).then(res => {
                console.log('权限修改成功')
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('user_info').where({ _id: db.command.neq(null) }).get().then(res => {
            this.setData({
                user_list: res.data
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