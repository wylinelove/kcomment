// pages/home1/home1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],   //存放查询电影列表
    start:0
  },
  jumpComment:function(event){
    // 1.添加参数event事件对象
    // 2.依据event获取自定义属性id
    // 3.舔砖pages/comment/comment参数id
    var id=event.target.dataset.id;
    wx.navigateTo({
      url: '/pages/comment/comment?id='+id,
    })
  },
  loadMore:function(n){
    wx.showLoading({
      title: '数据加载中....',
    })
    // 功能:当组件创建成功调用云函数获取云函数返回结果并显示
    // start 参数 0 10 20 30 

    // 调用云函数
    wx.cloud.callFunction({
      name: "movielist1906",
      data: { start:this.data.list.length }  //传递start
    })
      .then(res => {
        // 获取云函数返回结果并且保存list
        var rows = JSON.parse(res.result);
        rows= this.data.list.concat(rows.subjects)
        console.log(rows)
        wx.hideLoading()
        this.setData({list:rows})
      })
      .catch(err => {
        console.log(err);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
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
    // 加载下一页数据
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})