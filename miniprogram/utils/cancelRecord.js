const db = wx.cloud.database()

/**
 * 取消预约对数据库进行更新
 * @param {Object} record_item 预约记录
 */
function cancelRecord(record_item) {
    // 取消        
    db.collection('laboratory').doc(record_item.laboratory_id).get().then( res => {
        let temp_order = res.data.order
        // 如果是班级预约
        if (record_item.type == 1) {
            console.log('班级预约取消')
            // 班级预约状态
            temp_order[record_item.date][record_item.time].class_status = '可预约'
            // 个人预约状态
            temp_order[record_item.date][record_item.time].private_status = '可预约'
            // 调整容量
            temp_order[record_item.date][record_item.time].now_count = res.data.max_count
            db.collection('laboratory').doc(record_item.laboratory_id).update({
                data: {
                    order: temp_order,  // 调整状态
                    _updateTime: Date.parse(new Date()),  // 更新修改时间
                }
            })
        }

        // 如果是个人预约，且只有一个人预约了这个实验室
        else if (record_item.type == 0 
        && (res.data.order[record_item.date][record_item.time].now_count + 1 == res.data.max_count)) {
            console.log('个人预约取消')
            // 班级预约状态
            temp_order[record_item.date][record_item.time].class_status = '可预约'
            // 个人预约状态
            temp_order[record_item.date][record_item.time].private_status = '可预约'
            // 调整容量
            temp_order[record_item.date][record_item.time].now_count = res.data.max_count
            db.collection('laboratory').doc(record_item.laboratory_id).update({
                data: {
                    order: temp_order,  // 调整状态
                    _updateTime: Date.parse(new Date()),  // 更新修改时间
                }
            })
        }

        // 如果是个人预约，且 还有其他人预约了这个实验室
        else if (record_item.type == 0 
        && (res.data.order[record_item.date][record_item.time].now_count + 1 != res.data.max_count)) {
            console.log('个人预约取消')
            // 个人预约状态
            temp_order[record_item.date][record_item.time].private_status = '可预约'
            // 调整容量
            temp_order[record_item.date][record_item.time].now_count += 1
            db.collection('laboratory').doc(record_item.laboratory_id).update({
                data: {
                    order: temp_order,  // 调整状态
                    _updateTime: Date.parse(new Date()),  // 更新修改时间
                }
            })
        }
    })
}

module.exports = {
    cancelRecord: cancelRecord
}