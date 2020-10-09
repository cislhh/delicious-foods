import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
import Gopage from '../../utils/goPage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",//分类的id
    menu:[],//菜谱列表
    keyword:"",//关键字
    flag:0,//0代表从分类 ，1代表从搜索

    page:1,//当前页数
    isMore:true,//是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从分类过来-----id typeName
    //搜索过来-----keyword flag=1
    //设置导航
    wx.setNavigationBarTitle({
      title: options.typeName||"搜索结果",
    })
    this.data.id = options.id||"";
    this.data.keyword=options.keyword||"";
    this.data.flag = options.flag||0

    
  },
  _getMenuList:async function(page){
    if(!this.data.isMore){return}
    wx.showLoading({
      title: '加载中',
    })
    let where = null
    if(this.data.flag==0){
      //分类过来的
      where = {status:1,type_id:this.data.id}
    }
    if(this.data.flag==1){
      //搜索
      where = {
        menu_name:Db.db.RegExp({
          regexp: this.data.keyword,
          options: 'i',
        })
      }
    }
    let res = await Db.findByPage(Config.tables.menu,where,page,5,{field:"viex",sort:"desc"})
    if(res.data.length<5){
      this.data.isMore=false
  }
    if(res.data.length==0){
      wx.hideLoading()
      return 
    }
    let task=[]
    res.data.forEach(item=>{
      let p = Db.find(Config.tables.user,{_openid:item._openid})
      task.push(p)
    })
    let result = await Promise.all(task)
    res.data.forEach((item,index)=>{
      item.userInfo=result[index].data[0].userInfo
    })
    wx.hideLoading()
    this.setData({
      menu:this.data.menu.concat(res.data)
    })
  },
  //进入详情页面
  _goDetail:function(e){
    Gopage._goDetail(e)
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
    //获取到菜谱列表
    this._getMenuList()
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
    this.data.page++;
    this._getMenuList(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})