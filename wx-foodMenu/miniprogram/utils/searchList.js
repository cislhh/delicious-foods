//搜索关键字
const _search=(data)=>{
    let keyword = data.keyword;
    if(keyword==""){
      wx.showToast({
        title:"关键字不能为空",
        icon:"none"
      })
    }
    //将搜索框的关键词存储到缓存中
    let keywords = wx.getStorageSync('keywords')||[];
    let index = keywords.findIndex(item=>{
      item==keyword
    })
    if(index==-1){
      //没查到
      keywords.unshift(keyword);
    }else{
      //关键词列表有
      keywords.splice(index,1);
      keywords.unshift(keyword);
    }
    if(keywords.length>9){
      keywords.splice(9)
    }
    wx.setStorageSync('keywords', keywords)

    wx.navigateTo({
      url: `../recipelist/recipelist?keyword=${keyword}&flag=1`,
    })
  }
  export default{
    _search
  }