/**
 * 获取实验室所在教学楼的方法
 * @param {Array} laboratory_list 实验室列表
 * @param {Array} building_list 教学楼列表
 */
function getBuildInfo(laboratory_list, building_list) {
	let list = []
	for (let i = 0; laboratory_list[i] != null; i++) {
		for (let j = 0; building_list[j] != null; j++) {
			if(laboratory_list[i].building == building_list[j]._id) {
				laboratory_list[i].buildingInfo = building_list[j].building
				list.push(laboratory_list[i])
			}
		}
	}
	return list
}

/**
 * 获取实验室类型的方法
 * @param {Array} laboratory_list 实验室列表
 * @param {Array} category_list 实验室类型列表
 */
function getCateInfo(laboratory_list, category_list) {
	let list = []
	for (let i = 0; laboratory_list[i] != null; i++) {
		for (let j = 0; category_list[j] != null; j++) {
			if(laboratory_list[i].category == category_list[j]._id) {
				laboratory_list[i].categoryInfo = category_list[j].classification
				list.push(laboratory_list[i])
			}
		}
	}
	return list
}


module.exports = {
	getBuildInfo: getBuildInfo,
	getCateInfo: getCateInfo
}