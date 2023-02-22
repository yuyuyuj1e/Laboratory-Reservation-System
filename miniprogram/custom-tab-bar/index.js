// custom-tab-bar/index.js

import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../store/store'

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        "list": [
            {
              "pagePath": "/pages/home/home",
              "text": "首页",
              "iconPath": "/images/tab_home.png",
              "selectedIconPath": "/images/tab_home_active.png"
            },
            {
              "pagePath": "/pages/order/order",
              "text": "预约",
              "iconPath": "/images/tab_order.png",
              "selectedIconPath": "/images/tab_order_active.png"
            },
            {
                "pagePath": "/pages/rank/rank",
                "text": "排行",
                "iconPath": "/images/tab_rank.png",
                "selectedIconPath": "/images/tab_rank_active.png"
              },
            {
              "pagePath": "/pages/mine/mine",
              "text": "个人中心",
              "iconPath": "/images/tab_mine.png",
              "selectedIconPath": "/images/tab_mine_active.png"
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
            // event.detail 的值为当前选中项的索引
            // this.setData({ active: event.detail })
            console.log(this.data.list[event.detail].text + " tab-bar 被选中了")
            this.updateActive(event.detail)
            wx.switchTab({
              url: this.data.list[event.detail].pagePath,
            })
        }
    },

    /**
     *  开启 Vant Weapp 组件样式覆盖
     */
    options: {
        styleIsolation: 'shared',
    },

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
    }
})
