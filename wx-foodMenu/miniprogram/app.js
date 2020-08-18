//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this._checkLogin();
  },

  _checkLogin: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let openid = wx.getStorageSync('openid');
    if (userInfo && openid) {
      wx.checkSession({
        success: (res) => {
          console.log("检查成功")
          this.globalData.isLogin=true;
        },
        fail: (error) => {
          console.log("检查失败")
          this._login()
        }
      })
    }else{
      console.log("没有缓存")
      this._login()
    }

  },
  _login:function(){
    //检查是否授权
    wx.getSetting({
      withSubscriptions: true,
      success:res=>{
        //如果授权了，可读取用户信息
        if(res.authSetting["scope.userInfo"]){
          wx.login({
            success:res=>{
              //获取用户的openId值
              wx.cloud.callFunction({
                name:"login",
                success:res=>{
                  let openid = res.result.openid;
                  //获取用户的详细信息
                  wx.getUserInfo({
                    success:res=>{
                      let userInfo=res.userInfo
                      //设置成全局信息
                      wx.setStorageSync('userInfo', userInfo);
                      wx.setStorageSync('openid', openid);
                      this.globalData.isLogin = true;
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },


  globalData: {
    isLogin: false //全局登录状态
  }
})