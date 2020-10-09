// pages/pbmenu/pbmenu.js
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:[],//所有的分类,
    filesList:[]//我们选择的图片路径
  },
  //获取所有的分类
  _getType:async function(){
    let res=await Db.findAll(Config.tables.type)
    this.setData({
      types:res.data||[]
    })
  },
  //选择图片
  _selectImg:function(e){
    let filesList=e.detail.tempFilePaths.map((item)=>{
      return {
        url:item
      }
    })
    this.setData({
      filesList:filesList
    })
  },
  //删除预上传的图片
  _deleteImg:function(e){
    let index=e.detail.index;
    this.data.filesList.splice(index,1);
  },
  //发布菜谱
  _publishMenu:async function(e){
    console.log(e)
    let {menu_name,menu_detail,type_id}=e.detail.value;
    //判断数据的合法性
    if(this.data.filesList.length==0||menu_name==""||type_id==""||menu_detail==""){
      wx.showToast({
        title: '请完善菜谱信息',
        icon:'none'
      })
      return;
    }
    wx.showLoading({
      title:"发布中..."
    })
    //将菜谱图片上传
    let res =await Db._upload(this.data.filesList,"menu")
    //判断是否上传成功
    if(res.length==this.data.filesList.length){
       //获取上传之后的路径
      let menu_img=res.map(item=>{ return item.fileID})
      //先查询用户之前有没有发布过该类型的菜谱
      let _openid=wx.getStorageSync('openid');
      let result=await Db.find(Config.tables.userType,{
        _openid,
        type_id
      })
      if(result.data.length==0){
        //往用户类型表中插入一条数据
        Db.add(Config.tables.userType,{type_id})
      }
    
      //添加到数据库
      res=await Db.add(Config.tables.menu,{
        menu_name:menu_name,
        type_id:type_id,
        menu_img:menu_img,
        menu_detail:menu_detail,
        follow:0,
        view:0,
        status:1,
        time:new Date().getTime(),
      });
      wx.hideLoading();
      if(res._id){
        //可以直接跳转的菜谱详情页
        wx.navigateBack();
      }else{
        wx.showToast({
          title: '发布失败',
          icon:'none'
        })
      }
    }else{
      wx.showToast({
        title: '上传图片失败',
        icon:'none'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getType();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})