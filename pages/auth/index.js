import { login } from '../../utils/asyncWx'
import { request } from '../../request/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {},
  async handleGetUserInfo(e) {
    // 1、获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail
    // 2、获取登录成功的code值
    const { code } = await login()
    // 3、发送请求 获取用户token
    const token =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
    wx.setStorageSync('token', token)
  }
})
