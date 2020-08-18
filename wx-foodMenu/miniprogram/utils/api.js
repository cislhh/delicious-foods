//初始化数据库
let db = wx.cloud.database();
//数据库的添加
const add = (tableName, data = {}) => {
    //这里结果是一个promise对象，所以返回
    return db.collection(tableName).add({
        data
    })
}
const findById = (tableName, _id = "") => {
    return db.collection(tableName).doc(_id).get();
}
const find = (tableName, where = {}) => {
    return db.collection(tableName).where(where).get();
}
export default {
    add,
    findById,
    find
}