/*1 用户上滑页面 滚动条触底 开始加载下一页数据
	1 找到滚动条触底事件 onReachBottom
	2 判断还有没有下一页数据
1、获取到总页数，Math.ceil(总条数/页容量)
2、获取到当前页码
3、判断当前页码是否>=总页数
	3 假如没有下一页数据 弹出一个提示
	4 假如还有下一页数据 来加载下一页数据*/

/* 下拉刷新页面
1、触发下拉刷新事件
2、重置数组对象
3、重置页码为1
4、重新发送请求 
5、手动关闭下拉动画*/
import { request } from '../../request/index'

// pages/goods_list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    // 接口拿到的数
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 下拉触底
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据'
      })
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 监听用户刷新事件
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  },
  // 标题点击事件
  handletabsItemChange(e) {
    // 获取被点击的索引
    const { index } = e.detail
    // 修改原数组
    let { tabs } = this.data

    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    const total = res.total
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      //这个地方记得写data.message，因为之前视频中将他去掉了
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉动画
    wx.stopPullDownRefresh()
  }
})
