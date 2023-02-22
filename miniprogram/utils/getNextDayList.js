/**
 * 模拟到第二天实验室的预约情况
 * @param {Array} lab_list 实验室列表
 */
function getNextDayLabList (lab_list, record_list) {
    let new_list = lab_list
    for (let i in new_list) {
        let temp = new_list[i].order['后天']
        new_list[i].order['后天'] = new_list[i].order['temp']
        new_list[i].order['明天'] = temp
    }
    return new_list
}

/**
 * 模拟到第二天 预约记录
 * @param {Array} record_list 预约记录列表
 */
function getNextDayRecordList (record_list) {
    let new_list = record_list
    for (let i in new_list) {
        if (new_list[i].date == '明天') {
            new_list[i].date = '今天'
            new_list[i].enable = false
        }
        else if (new_list[i].date == '后天') {
            new_list[i].date = '明天'
        }
    }
    return new_list
}

module.exports = {
    getNextDayLabList: getNextDayLabList,
    getNextDayRecordList: getNextDayRecordList
}