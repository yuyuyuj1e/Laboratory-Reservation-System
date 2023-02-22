/**
 * 格式化
 * @param {number} n 
 */
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 获取当前时间
 * @param {Date()} date Date对象 
 */
function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 获取当前日期
 * @param {Date()} date Date对象 
 */
function formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}


/**
 * 获取d当前时间多少天后的日期和对应星期
 * @param {int} days 往后多少天
 * @param {string} todate 格式:2022-03-10 选定的日期
 */
function getDates(days, todate=formatDate(new Date())) {  //todate默认参数是当前日期，可以传入对应时间
    let dateArry = [];
    for (let i = 1; i < days + 1; i++) {
      let dateObj = dateLater(todate, i);
      dateArry.push(dateObj)
    }
    return dateArry;
}

/**
 * 传入时间后几天
 * @param {string} dates 格式:2022-03-10 选定的日期
 * @param {int} later 往后多少天
 */
function dateLater(dates, later) {
    let dateObj = [];
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let year = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj = [year, month, day].map(formatNumber).join('-')
    return dateObj;
}


module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    getDates: getDates
}