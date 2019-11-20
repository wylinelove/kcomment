// pages/comment/comment.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    content:"",
    score:0,  
    detail:{}, //云函数返回结果
    images:[],  //选中图片效果
    fileIds:[],  //上传成功后文件fileId
    createTime:0
  },
  submit:function(){
    // 功能:发表评论
    // 1.上传多张图片
    // 2.将图片fileID,评论,分数保存
    // 1.创建数据库对象
    // 2.将data中添加fileIds:[]
    // 3.显示数据加载提示框
    wx.showLoading({
      title: '发表评论中',
    });
    //窗件数据
    var rows=[];
    if(this.data.images.length==0){
      wx.showToast({
        title: '请选图片',
      });
      return;
    }
    //创建循环遍历选中图片 images
    for(var i=0;i<this.data.images.length;i++){
      // 6.上传一张图片
      // 7.创建一个promise对象完成上传图片操作
      // 将promise保存数组中
      rows.push(new Promise((resolve,reject)=>{
      // 8.获取当前要上传图片的名称
      var item=this.data.images[i];
      // 9.获取图片名称后缀.jpg .png .gif
      // 正则表达式 /\.\w+$/
      var su=/\.\w+$/.exec(item)[0];
      // 10.创建新的文件名  时间+随机数+后缀
      var newFile = new Date().getTime();
      newFile+=Math.floor(Math.random()*999);
      newFile+=su;
      // 11.上传指定图片
      wx.cloud.uploadFile({
        cloudPath:newFile, //新文件名
        filePath:item,     //原文件名
        success:(res=>{    //长传成功
          // 12.将上传成功fileID保存数组
          var fid=res.fileID;
          this.data.fileIds.push(fid);
          // 13.调用解析方法
          resolve();
        })
      })
      // 12.将上传成功fileID保存数组

      // 13.调用解析方法
      }))//promise
    }//for
    // 14.等待所有promise对象执行完毕(上传)
    // 15.将云数据库中添加一条记录
    Promise.all(rows).then(res=>{
      // 16.在云开发控制面板汇总添加集合comment1906
      // 17.获取分数
      var s=this.data.score;
      // 18.留言
      var m=this.data.content;
      // 19.获取上传到云存储所有fid
      var fids=this.data.fileIds;
      // 20.向集合comment1906中添加一条记录
     db.collection("comment1906")
      .add({
        data:{
          content:m,
          score:s,
          fileIds:fids,
          createTime: db.serverDate(), //添加该字段
          movieId:this.data.id
        }
      })
      .then(res=>{
        wx.hideLoading();
        wx.showToast({
         title: '评论成功',
        })
        this.mentShow();
        this.data.fileIds=[];
        this.setData({
          score:0,
          content:'',
          images:[],
          createTime:0,
          movieId:0
        })
      })
      .catch(err=>{
      
        console.log(err);
      })
    // 21.添加成功隐藏功能加载提示框
    // 22.显示提示框评论成功
    })

  },
  selectImg:function(){
    // 功能:选中多张图片;并且预览效果
    // 1.选中多长图片
    // 2.指定图片类型,图片来源
    // 3.指定图片数量 9
    // 4.选中成功
    wx.chooseImage({
      count:9,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: (res)=>{
        if(this.data.images.length>0){
          var list=[].concat(this.data.images,res.tempFilePaths)
          this.setData({
            images: list
          })
        }else{
          this.setData({
            images: res.tempFilePaths
          })
        }
      },
    })
    // 5.在data添加属性image:[],
    // 6.将返回结果保存image
    // 7.在模板显示图片
  },
  onContentChange:function(event){
    // 1.添加参数event
    // 2.获取event.detail 输入内容保存content中
    this.setData({
      content:event.detail
    })
  },
  onScoreChange:function(event){
    // 功能:修改分数
    // 添加分数
    // 获取event.detail输入分数保存score
    this.setData({
      score:event.detail
    })
  },
  loadMore:function(id){
    wx.showLoading({
      title: '数据加载中....',
    })
    wx.cloud.callFunction({
      name: "findDetail1906",
      data: { id: id }
      })
      .then(res => {
        var rows = JSON.parse(res.result);
        this.setData({detail:rows});
        console.log(this.data.detail);
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err);
      })
  },
  mentShow: function () {
    db.collection("comment1906")
      .where({movieId:this.data.id})
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log(res);
        this.setData({
          comment: res.data
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({id});
    this.loadMore(id);
    this.mentShow();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})