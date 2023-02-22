// 在这个JS文件中，专门创建 Store 的实例对象
import { action, observable } from 'mobx-miniprogram'

export const store = observable({
    // 共享数据字段
    activeTabIndex: 0,  // 页面索引
    // 计算属性
    get sum() {  // get 表示这个方法是只读的 不能进行赋值
        return this.numA + this.numB
    },
    // actions 方法， 用来修改 stroe 中的数据 
    // 外界只能通过调用方法 来修改 stroe 中的数据 不能直接修改数据
    updateTabBarIndex: action(function(index) {
        this.activeTabIndex = index
    })
})