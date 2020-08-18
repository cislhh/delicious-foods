let baseUrl = "http://localhost:3000";
const http = (options)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:baseUrl+options.url,
      data:options.data||{},
      method:options.method||"get",
      header:options.header||{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:resolve,
      fail:reject
    })
  })
}

export{
  http
}