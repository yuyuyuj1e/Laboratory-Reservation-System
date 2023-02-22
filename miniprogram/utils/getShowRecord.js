/**
 * 获取满足状态的预约列表———我的预约
 * @param {Array} appointment_record_list 全部预约列表
 * @param {int} index 状态索引
 */
function getShowRecodMine(appointment_record_list, index) {
    let show_list = []
    // 全部
    if(index == 0) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].enable) {
                show_list.push(appointment_record_list[i])
            }
        }
    }
    // 审核中
    else if(index == 1) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].enable && !appointment_record_list[i].status) {
                show_list.push(appointment_record_list[i])
            }
        }
    }
    // 个人预约
    else if(index == 2) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].type == 0 && appointment_record_list[i].enable && appointment_record_list[i].status ) {
                show_list.push(appointment_record_list[i])
            }
        }     
    }
    // 班级预约
    else if(index == 3) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].type == 1 && appointment_record_list[i].enable && appointment_record_list[i].status) {
                show_list.push(appointment_record_list[i])
            }
        }       
    }
    // 失效预约
    else if(index == 4) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(!appointment_record_list[i].enable ) {
                show_list.push(appointment_record_list[i])
            }
        }
    }
    return show_list
}


/**
 * 获取满足状态的预约列表———预约管理
 * @param {Array} appointment_record_list 全部预约列表
 * @param {int} index 状态索引
 */
function getShowRecodAdminstration(appointment_record_list, index) {
    let show_list = []
    // 全部
    if(index == 0) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].enable) {
                show_list.push(appointment_record_list[i])
            }
        }
    }
    // 审核中
    else if(index == 1) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(!appointment_record_list[i].status) {
                show_list.push(appointment_record_list[i])
            }
        }     
    }
    // 已通过
    else if(index == 2) {
        for(let i = 0; appointment_record_list[i] != null; i++) {
            if(appointment_record_list[i].status) {
                show_list.push(appointment_record_list[i])
            }
        }       
    }
    return show_list
}


module.exports = {
    getShowRecodMine: getShowRecodMine,
    getShowRecodAdminstration: getShowRecodAdminstration
}