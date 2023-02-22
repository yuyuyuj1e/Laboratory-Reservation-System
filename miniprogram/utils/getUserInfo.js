const db = wx.cloud.database();
/**
 * 获取用户信息
 */
function getUserInfo() {
    // 获取用户信息
    wx.getUserProfile ({
        desc: '请求获取用户信息',
        success: (res_userinfo) => {
            console.log("用户同意获取信息"),
            // 获取用户openid
            wx.cloud.callFunction({
                name: 'getOpenID',
                success:(res_openid)=> {
                    getApp().globalData.user_openid = res_openid.result.openid  // 将openid放入到全局变量中        
                    console.log("成功获取用户openid：" + res_openid.result.openid)

                    // 判断当前用户是否是曾经登录过的用户  如果是 当如用户信息  如果不是 新建用户信息  
                    db.collection("user_info").doc(res_openid.result.openid).get().then( result => {
                        console.log("用户信息已存在")
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
                                alter: true,  // 修改权限，新用户第一次被录入后不可以直接修改
                                gender: "保密",
                                date_of_birth: "2000-01-01",
                                nickname: res_userinfo.userInfo.nickName,
                                logo: res_userinfo.userInfo.avatarUrl,
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
}

module.exports = {
    getUserInfo: getUserInfo
}