/*  1、获取用户的收货地址
        1 绑定点击事件
        2 调用小程序内置 api 
    2、获取用户对小程序 所授予 获得地址的权限状态 scope
        确定 取消 未进行点击 
        true  undefined直接调用收货地址
        false 不可直接调用
        值得深思

    2 页面加载完毕
      onShow
      1、获取本地存储中的地址数据
      2、把数据 设置给data中的一个变量 

    3、页面onshow
      1 获取缓存中的购物车数组
      2 把购物车数据 填充到data中 
    4、全选的实现 数据的展示 
          1 onshow获取缓存中的购物车数组
          2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
    5、总价格和总数量
         遍历购物车数组，判断商品是否被选中，计算总价格以及总数量
    6、商品的选中 
         1 绑定change事件
         2 获得到被修改的商品对象
         3 商品对象的选中状态
         4 重新填充回data中和缓存中
         5 从新计算全选 总价格和总数量 
    7、全选按钮功能
        1、全选复选框绑定change事件
        2、获取data中的全选变量allChecked
        3、直接取反allChecked
        4、遍历购物车，让其中的选中状态 跟随allChecked来变化 
        5、把购物车数组和allChecked重设回缓存中   
    8、商品数量的编辑
        1、绑定点击事件 通过自定义属性来区分
        2、传递被点击商品的id goods_id 
        3、获取data中的购物车数组 来获取需要被修改的商品对象
        4、直接修改商品对象的数量 num
        5、把cart数组 重新设置回 缓存和data中
        6、当商品数量为1，再点击-号需要弹窗提示
    9、结算
        1、判断有没有收获地址信息
        2、判断用户有没有选购商品
        3、验证后跳转到支付页面*/

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
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address')
    const cart = wx.getStorageSync('cart') || []
    // 计算全选
    // every() 数组方法，会遍历数组 接受一个回调函数，
    //每一个都返回true，则every方法的返回值为true，空数组也返回true
    this.setData({ address })
    this.setCart(cart)
  },
  // 点击售货地址按钮事件
  async handleChooseAddress() {
    try {
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      if (scopeAddress === false) {
        await openSetting()
      }
      const address = await chooseAddress()
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  handelItemChange(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
  },
  // 设置购物车状态以及计算价格,并将数据填充回data
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      // 判断选中的商品，算出他们的总价和数量
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length != 0 ? allChecked : false
    // 把购物车数据重设进data以及缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  },
  handelItemAllChange() {
    // 1、获取data中的数据
    let { cart, allChecked } = this.data
    // 2、修改值
    allChecked = !allChecked
    // 3、循环修改cart数组
    cart.forEach((v) => (v.checked = allChecked))
    // 4、把修改后的值填充回data或者缓存中
    this.setCart(cart)
  },
  // 修改商品数量
  async handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset
    let { cart } = this.data
    const index = cart.findIndex((v) => v.goods_id === id)
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您是否要删除?' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 进行修改数量,operation的值为1和-1，如下操作就可以使num+1 -1
      cart[index].num += operation
      this.setCart(cart)
    }
  },
  // 结算功能
  async handlePay() {
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: '您还没有选择收货地址！' })
      return
    }
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品！' })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})
