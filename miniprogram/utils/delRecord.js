/**
 * 删除记录，使记录失效
 * @param {Array} show_record_list 预约记录列表
 * @param {int} record_index 预约记录索引
 */
function delEnable(show_record_list, record_index) {
    let new_list = []
    for (let i = 0; show_record_list[i] != null; i++) {
        // 如果该记录已经失效 并且是 要删除的 ID, 跳过
        if (i == record_index) {
            continue
        }
        else {
            new_list.push(show_record_list[i])
        }
    }
    return new_list
}


/**
 * 删除失效记录
 * @param {Array} show_record_list 预约记录列表
 * @param {int} record_index 预约记录索引
 */
function delDisable(show_record_list, record_index) {
    let new_list = []
    for (let i = 0; show_record_list[i] != null; i++) {
        // 如果该记录已经失效 并且是 要删除的 ID, 跳过
        if (i == record_index) {
            continue
        }
        else {
            new_list.push(show_record_list[i])
        }
    }
    return new_list
}

module.exports = {
    delEnable: delEnable,
    delDisable: delDisable
}