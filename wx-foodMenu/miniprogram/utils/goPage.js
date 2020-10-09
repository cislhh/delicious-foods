//进入详情页面
const _goDetail = (e) => {
  let {
    id,
    menuName
  } = e.currentTarget.dataset;
  wx.navigateTo({
    url: `../recipeDetail/recipeDetail?id=${id}&menuName=${menuName}`,
  })
}
//进入搜索列表页面
const _goMenuList = (e) => {
  let keyword = e.currentTarget.dataset.keyword
  wx.navigateTo({
    url: `../recipelist/recipelist?keyword=${keyword}&flag=1`,
  })
}

export default {
  _goDetail,
  _goMenuList
}