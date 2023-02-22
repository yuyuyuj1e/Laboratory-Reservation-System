/**
 * 将实验室列表中的 预约状态 根据 预约记录 进行修正
 * @param {Array} laboratory_list 实验室列表
 * @param {Array} appointment_record_list 预约记录列表
 * @param {string} date 预约日期
 * @param {string} time 预约时间 0 或 1, 0表示早上 1表示下午
 * 满足预约的条件：
 * 1. 实验室的ID和预约记录表中实验室ID相同
 * 2. 同时这条记录的用户ID等于正在次使用程序用户的ID
 * 3. 时间和日期也都相同
 * 4. 预约记录为个人预约
 */
function getStatus(laboratory_list, appointment_record_list, date, time) {
    let new_list = []  // 返回带有 已预约信息的 新列表
    let user_id = getApp().globalData.user_openid
    for (let i = 0; laboratory_list[i] != null; i++) {
        for(let j = 0; appointment_record_list[j] != null; j++) {
            // 实验室的ID和预约记录表中实验室ID相同 并且 用户ID和预约记录中用户ID相同
            if(laboratory_list[i]._id == appointment_record_list[j].laboratory_id && user_id == appointment_record_list[j].user_id) {
                // 时间日期都相同，并且记录是班级预约
                if(date == appointment_record_list[j].date && time == appointment_record_list[j].time && appointment_record_list[j].type == "0") {
                    console.log('个人状态')
                    laboratory_list[i].order[date][time].private_status = '已预约';
                    new_list.push(laboratory_list[i])
                }
            }
        }
    }
    return new_list
}

/**
 * 将实验室列表中的 预约状态 根据 预约记录 进行修正
 * @param {Array} laboratory_list 实验室列表
 * @param {Array} appointment_record_list 预约记录列表
 * @param {string} date 预约日期
 * @param {string} time 预约时间 0 或 1, 0表示早上 1表示下午
 * 满足预约的条件：
 * 1. 实验室的ID和预约记录表中实验室ID相同
 * 2. 同时这条记录的用户ID等于正在次使用程序用户的ID
 * 3. 时间和日期也都相同
 * 4. 预约记录为班级预约
 */
function getStatusClass(laboratory_list, appointment_record_list, date, time) {
    let new_list = []  // 返回带有 已预约信息的 新列表
    let user_id = getApp().globalData.user_openid
    for (let i = 0; laboratory_list[i] != null; i++) {
        for(let j = 0; appointment_record_list[j] != null; j++) {
            // 实验室的ID和预约记录表中实验室ID相同 并且 用户ID和预约记录中用户ID相同
            if(laboratory_list[i]._id == appointment_record_list[j].laboratory_id && user_id == appointment_record_list[j].user_id) {
                // 时间日期都相同，并且记录是班级预约
                if(user_id == appointment_record_list[j].user_id && appointment_record_list[j].type == "1") {
                    console.log('班级状态')
                    laboratory_list[i].order[date][time].class_status = '已预约';
                    new_list.push(laboratory_list[i])
                }
            }
        }
    }
    return new_list
}


module.exports = {
    getStatus: getStatus,
    getStatusClass: getStatusClass
}