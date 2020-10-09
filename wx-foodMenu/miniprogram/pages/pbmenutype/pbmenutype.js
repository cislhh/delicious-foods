// pages/pbmenutype/pbmenutype.js
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtn: false, //显示添加
    updateBtn: false, //显示修改
    typeName: "", //分类名称
    updateType:"",//要修改的分类object
    types:[],//所有菜谱的分类
  },
  //获取我们所有的分类
  _getType:async function(){
    wx.showLoading({
      title:"加载中"
    })
   let types =  await Db.findAll(Config.tables.type)
   this.setData({
     types:types.data||[]
   })
   wx.hideLoading()
  },
  //显示添加组件
  _showAdd: function () {
    this.setData({
      addBtn: !this.data.addBtn
    })
  },
  //显示修改组件
  _showUpdate:function(e){
    let {index} = e.currentTarget.dataset
    this.setData({
      updateBtn:!this.data.updateBtn,//有BUG
      updateType:this.data.types[index],
      typeName:this.data.types[index].typeName
    })
  },
  //获取添加分类内容
  _inputAdd: function (e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  //获取修改框输入的值
  _inputUpdate:function(e){
    this.setData({
      typeName:e.detail.value
    })
  },
  //添加分类
  _addType: async function () {
    //判断分类是否为空
    if (this.data.typeName == "") {
      wx.showToast({
        title: '名称不能为空',
        icon: none
      })
      return;
    }
    //判断分类表中有没有相同分类名称(findIndex方法)
    let index = this.data.types.findIndex(item=>{
      return item.typeName==this.data.typeName
    })
    if(index!=-1){
      wx.showToast({
        title: '分类名称已存在',
        icon:"none"
      })
      return
    }
    //最后添加
    let res = await Db.add(Config.tables.type, {
      typeName: this.data.typeName
    });
    //初始化分类名称
    this.setData({
      typeName: ""
    })
    this._showAdd()
    this._getType()
    if (res._id) {
      wx.showToast({
        title: '添加分类成功',
      })
    } else {
      wx.showToast({
        title: '添加分类失败',
        icon: none
      })
    }
  },
  //删除分类
  _deleteType:function(e){
    let {index} = e.currentTarget.dataset;
    wx.showModal({
      title:"提示",
      content:"确定删除吗？",
      success:async res=>{
        if(res.confirm){
          res = await Db.remove(Config.tables.type,this.data.types[index]._id);
          wx.showToast({
            title: '删除成功',
          })
          this._getType()
        }else{
          wx.showToast({
            title: '删除失败',
            icon:"none"
          })
        }
      }
    })
  },
  //修改分类
  _updateType:async function(){
    if(this.data.typeName==""){
      wx.showToast({
        title: '分类名不能为空',
        icon:"none"
      })
      return 
    }
    //查询修改后是否有同名的分类名称(查询数据库模式)
    let res = await Db.find(Config.tables.type,{typeName:this.data.typeName});
    if(res.data.length!=0){
      wx.showToast({
        title: '分类已存在',
        icon:"none"
      })
      return 
    }

    res = await Db.update(Config.tables.type,this.data.updateType._id,{
      typeName:this.data.typeName
    })
    if(res.stats.updated){
      wx.showToast({
        title: '修改成功',
      })
      this._getType()
    }else{
      wx.showToast({
        title: '修改失败',
        icon:"none"
      })
    }

    this.setData({
      updateBtn:false,
      updateType:{},
      typeName:""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getType()
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