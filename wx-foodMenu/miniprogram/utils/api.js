//初始化数据库
let db=wx.cloud.database()
const _ = db.command
//数据库的添加
const add=(tableName,data={})=>{
    return db.collection(tableName).add({
        data:data
    })
}
//根据id取一条数据
const findById=(tableName,_id="")=>{
    return db.collection(tableName).doc(_id).get();
}
//取多条数据，有限制，最多取20条
const find=(tableName,where={})=>{
    //小程序端的查询数据库最多只能查询20条数据
    return db.collection(tableName).where(where).get();
}
//取所有
const findAll=async (tableName,where={})=>{
  const MAX_LIMIT=100 //一次取多少条
  const countResult = await db.collection(tableName).count() //查询有多少条记录 501
  const total = countResult.total  //总条数501
  //如果数据库没有数据我们返回一个空数组
  if(total==0){
    return [];
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total /MAX_LIMIT)   //6
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(tableName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
//分页获取数据
const findByPage=(tableName,where={},page=1,limit=5)=>{
  //获取页面的偏移量
  let start=(page-1)*limit
  return db.collection(tableName)
  .where(where)
  .skip(start)
  .limit(limit)
  .get()
}
//修改
const update = (tableName,_id,data={})=>{
    return db.collection(tableName).doc(_id).update({
        data:data
    })
}
//删除
const remove=(tableName,_id)=>{
    return db.collection(tableName).doc(_id).remove()
}
//根据条件进行删除
const removeByWhere=(tableName,where={})=>{
  return db.collection(tableName).where(where).remove()
}
//上传
const _upload=(filesList,dir="upload")=>{
    let promiseTask=[];
    filesList.forEach((item,index)=>{
      //item.url //即将要上传的图片路径
      //获取图片的后缀名称
      let ext = item.url.split(".").pop()
      //上传之后文件的名称
      let fileName=(new Date()).getTime()+"-"+index+"."+ext;
      let task=wx.cloud.uploadFile({
        cloudPath:dir+"/"+fileName,//上传后台在云上的路径
        filePath:item.url//即将要上传的图片的路径，
      })
      promiseTask.push(task)
    })
    return Promise.all(promiseTask)
}
export default {
    add,
    findById,
    find,
    findAll,
    remove,
    update,
    _upload,
    findByPage,
    removeByWhere,
    _,
    db
}