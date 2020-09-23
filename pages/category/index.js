import { request } from '../../request/index'
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    //接口返回的数据
    Cates: [],
    //当前索引
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1、本地存储中有无旧数据
    // 2、无-发送新请求
    // 3、有旧数据，即使用旧数据

    // 获取本地存储的数据
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getCates()
    } else {
      //有旧数据，需判断是否过期
      if (Date.now - Cates.time > 1000 * 300) {
        this.getCates()
      } else {
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map((v) => v.cat_name)
        //右侧商品数据
        let rightMenuList = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightMenuList
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    // 	url: '/categories'
    // }).then((res) => {
    // 	this.Cates = res.data.message;
    // 	// 把数据存进storage
    // 	wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    // 	//构造左侧的菜单数据
    // 	let leftMenuList = this.Cates.map((v) => v.cat_name);
    // 	//右侧商品数据
    // 	let rightMenuList = this.Cates[0].children;

    // 	this.setData({
    // 		leftMenuList,
    // 		rightMenuList
    // 	});
    // });
    const res = await request({ url: '/categories' })
    this.Cates = res
    // 把数据存进storage
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //构造左侧的菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name)
    //右侧商品数据
    let rightMenuList = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightMenuList
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    console.log(e)
    // 1、获取被点击标题上的索引
    // 2、给data中的currentIndex赋值
    // 3、根据不同的索引渲染右侧的内容
    const { index } = e.currentTarget.dataset
    let rightMenuList = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightMenuList
    })
  }
})
