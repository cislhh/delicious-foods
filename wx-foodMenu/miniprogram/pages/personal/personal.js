// pages/personal/personal.js
let app=getApp();
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
import Gopage from '../../utils/goPage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,//是否登录
    userInfo:"",//用户信息
    currentIndex:0,//选项卡的序号,
    myMenu:[],//我的菜谱,
    myMenuPage:1,//标示我们获取第几页的数据
    myMenuIsMore:true,//我的菜谱有没有更多的数据了，
    myType:[],//我的类型
    myFollow:[],//我关注的菜谱
  },
  //获取用户的授权
  _getUserInfo:function(e){
    //获取用户的详情
    let userInfo=e.detail.userInfo;
    //获取用户的openid作为用户的唯一标示
    wx.login({
      success:async res=>{
       let result= await wx.cloud.callFunction({
          name:"login",
          data:{}
        })
        if(result.result.openid){//获取openid值成功
          //设置全局登录信息
          wx.setStorageSync('userInfo',userInfo);
          wx.setStorageSync('openid', result.result.openid);
          app.globalData.isLogin=true;
          //设置登录页面的数据
          this.setData({
            userInfo:userInfo,
            isLogin:true
          })
          this._getMyMenu(1);
            //获取我发布的菜谱类型
          this._getMyType();
          //先查询用户有没有存储过我们的用户信息，
          let res=await Db.find(Config.tables.user,{_openid: result.result.openid})
          if(res.data.length==0){
            //将用户的信息存入到数据库
            res=await Db.add(Config.tables.user,{userInfo:userInfo});
            //获取我发布的菜谱信
            if(res._id){
              wx.showToast({
                title: '登录成功',
              })
            }
          }
        }
      }
    })
  },
  //进入我们的分类管理页面
  _goAdmin:function(){
    if(Config.admin==wx.getStorageSync('openid')){
        wx.navigateTo({
          url: '../pbmenutype/pbmenutype',
        })
    }
   
  },
  //切换选项卡
  _switchTab:function(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      currentIndex:index
    })
  },
  //进入发布
  _goPublishMenu:function(){
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  //获取我发布的菜谱
  _getMyMenu:async function(page){
    if(!this.data.myMenuIsMore){
      wx.showToast({
        title: '我们是有底线的',
        icon:'none'
      })
      return 
    }
    wx.showLoading({
      title: '数据加载中',
    })
    //获取数据
    let _openid=wx.getStorageSync('openid');
    let res = await Db.findByPage(Config.tables.menu,{
      _openid:_openid,
      status:1
    },page,5,{field:'time',sort:'desc'})
    wx.hideLoading();
    //如果没有获取的任何数据
    if(res.data.length==0){
      this.setData({
        myMenuIsMore:false
      })
      wx.showToast({
        title: '我们是有底线的',
        icon:'none'
      })
      return false;
    }

    this.setData({
      myMenu:this.data.myMenu.concat(res.data)
    })
  },
  //删除菜谱
  _deleteMyMenu:async function(e){
    let {index,id}=e.currentTarget.dataset;
    console.log(index,id);
    let res= await Db.update(Config.tables.menu,id,{status:0})
    if(res.stats.updated){
      this.data.myMenu.splice(index,1);
      this.setData({
        myMenu:this.data.myMenu
      })
      wx.showToast({
        title: '删除成功',
      })
    }else{
      wx.showToast({
        title: '删除失败',
        icon:'none'
      })
    }
  },
  //获取菜谱类型
  _getMyType:async function(){
    let _openid=wx.getStorageSync("openid")
    let res=await Db.findAll(Config.tables.userType,{
      _openid
    });
    if(res.data){//取到数据了
      let task=[]
      res.data.forEach(item=>{
        //根据分类的_id查询分类表中的数据
        let p =Db.findById(Config.tables.type,item.type_id)
        task.push(p)
      })
      let result=await Promise.all(task)
     //对返回的数据处理
      let myType=result.map(item=>{
       return item.data
      })
      this.setData({
        myType
      })
    }else{
      this.setData({
        myType:[]
      })
    }
  },
  //进入详情页面
  _goDetail:function(e){
    Gopage._goDetail(e)
  },
  //进入菜谱列表页
  _goMenuList:function(e){
    let {id,typeName} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&typeName=${typeName}`,
    })
},
  //我的关注
  _getMyFollow:async function(){
    //根据openid查询关注表，我的关注
    let _openid = wx.getStorageSync('openid');
    let res  = await Db.findAll(Config.tables.follow,{_openid})
    if(res.data.length==0){
      this.setData({
        myFollow:[]
      })
    }else{
      //获取每一个关注的菜谱的详情
      let task=[];
      res.data.forEach(item=>{
       let p =  Db.findById(Config.tables.menu,item.menu_id);
       task.push(p)
      })
      let result = await Promise.all(task)
      result=result.map(item=>{
        return item.data
      })
      this.setData({
        myFollow:result
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("执行了")
    this.setData({
      userInfo:wx.getStorageSync('userInfo')||"",
      isLogin:app.globalData.isLogin,
      myMenu:[],
      myMenuIsMore:true,
      myMenuPage:1
    })
    if(this.data.isLogin){
      //获取我发布的菜谱信息
      this._getMyMenu(1);
      //获取我发布的菜谱类型
      this._getMyType();
      //获取我的关注
      this._getMyFollow();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.myMenuPage++;
    this._getMyMenu(this.data.myMenuPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})