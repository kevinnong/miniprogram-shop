import { request } from '../../request/index'
Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    // 发送异步请求获得轮播图数据
    request({ url: '/home/swiperdata' }).then((result) => {
      this.setData({
        swiperList: result
      })
    })
  },
  getCatesList() {
    // 发送异步请求获得轮播图数据
    request({ url: '/home/catitems' }).then((result) => {
      this.setData({
        catesList: result
      })
    })
  },
  getFloorList() {
    // 发送异步请求获得轮播图数据
    request({ url: '/home/floordata' }).then((result) => {
      this.setData({
        floorList: result
      })
    })
  }
})
