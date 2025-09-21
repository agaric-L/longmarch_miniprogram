Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    totalSteps: 0,
    todaySteps: 0,
    longMarchSteps: 0,
    currentLocation: '未开始',
    unlockedChapters: 0
  },

  onLoad() {
    this.getUserInfo();
    this.getStepData();
  },

  getUserInfo() {
    // 检查是否已经授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，直接获取用户信息
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
            },
            fail: () => {
              // 获取失败，清除授权状态
              this.setData({
                hasUserInfo: false
              });
            }
          });
        } else {
          // 未授权
          this.setData({
            hasUserInfo: false
          });
        }
      }
    });
  },

  getUserProfile() {
    // 请求用户授权
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('用户授权成功', res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.log('用户拒绝授权', err);
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        });
      }
    });
  },

  getStepData() {
    // 模拟获取步数数据
    this.setData({
      totalSteps: 166931,
      todaySteps: 8070,
      longMarchSteps: 46980,
      currentLocation: '未开始',
      unlockedChapters: 3
    });
  },

  refreshData() {
    wx.showLoading({
      title: '刷新中...'
    });
    
    // 模拟刷新延迟
    setTimeout(() => {
      this.getStepData();
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  goToStepExchange() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});