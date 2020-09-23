/* 1、点击请求获取数据
2、点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序api previewImage
3、点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断 当前商品是否已经存在 购物车
  4 已经存在 修改商品数据 执行购物车数量++重新把购物车数组填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上 购买数量属性 num
  6 弹出用户提示 */
import { request } from '../../request/index'
Page({
  data: {
    goodsObj: {}
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj
    this.setData({
      // 重新赋值
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone不识别webp图片格式
        // 临时改，需要确保后台存在 1.webp =>1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid)
    // 接收传递过来的图片url,在轮播图中通过data-url传递url，再如下获取
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1、获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || []
    // 2、判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      //3、不存在 第一次添加商品以及num和checked选中状态
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 4、已经存在 执行num++
      cart[index].num++
    }
    // 5、把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart)
    // 6、微信弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  }
})
