/**
 * 将实验室按按热度从高往低排序
 * @param {Array} arr 实验室列表
 */
function quickSortLab(arr){
    var left = [], right = [];
    // 返回条件
    if(arr.length <= 1){
        return arr;
    }

    var index = Math.floor(arr.length / 2);  // 取一个基准值，此时取出来的为一个数组
    var item = arr.splice(index, 1)[0];  // 取出数组中的基准值（将基准值从原数组中截取出来）
    var p = item.popularity;

    for (var i = 0; i < arr.length; i++){
        if(arr[i].popularity >= p) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
   // 运用递归
    return quickSortLab(left).concat(item, quickSortLab(right));  // 将左右两边数组连接起来
};


/**
 * 将评论按热度排序
 * @param {Array} arr 评论列表
 */
function quickSortCommentP(arr){
    var left = [], right = [];
    // 返回条件
    if(arr.length <= 1){
        return arr;
    }

    var index = Math.floor(arr.length / 2);  // 取一个基准值，此时取出来的为一个数组
    var item = arr.splice(index, 1)[0];  // 取出数组中的基准值（将基准值从原数组中截取出来）
    var p = item.count;

    for (var i = 0; i < arr.length; i++){
        if(arr[i].count >= p) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
   // 运用递归
    return quickSortCommentP(left).concat(item, quickSortCommentP(right));  // 将左右两边数组连接起来
};


/**
 * 将评论按时间排序
 * @param {Array} arr 评论列表
 */
function quickSortCommentN(arr){
    var left = [], right = [];
    // 返回条件
    if(arr.length <= 1){
        return arr;
    }

    var index = Math.floor(arr.length / 2);  // 取一个基准值，此时取出来的为一个数组
    var item = arr.splice(index, 1)[0];  // 取出数组中的基准值（将基准值从原数组中截取出来）
    var p = item._createTime;

    for (var i = 0; i < arr.length; i++){
        if(arr[i]._createTime >= p) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
   // 运用递归
    return quickSortCommentN(left).concat(item, quickSortCommentN(right));  // 将左右两边数组连接起来
};

module.exports = {
    quickSortLab: quickSortLab,
    quickSortCommentP: quickSortCommentP,
    quickSortCommentN: quickSortCommentN
}