/* 1、页面加载的时候
  从缓存中获取购物车数据 渲染相应的商品信息 checked=true
  2、微信支付
    1、哪些人 哪些账号可以实现微信支付
     "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo" 
  3、支付按钮
    1、先判断缓存中有无token
    2、没有就要进行获取
    
  4、创建订单*/
import { request } from '../../request/index'

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address')
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter((v) => v.checked)

    this.setData({ address })

    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      // 判断选中的商品，算出他们的总价和数量
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 把购物车数据重设进data以及缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  async handleOrderPay() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    const header = token
    const order_price = this.data.totalPrice
    const consigee_addr = this.data.address.all
    const cart = this.data.cart
    let goods = []
    cart.forEach((v) =>
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      })
    )
    const orderParams = { order_price, consigee_addr, goods }
    const res = await request({
      url: 'my/orders/create',
      method: 'post',
      data: orderParams,
      header: header
    })
    console.log(res)
  }
})
