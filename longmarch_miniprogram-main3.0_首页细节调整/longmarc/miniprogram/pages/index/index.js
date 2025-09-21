Page({
  data: {
    todaySteps: 0,
    wechatSteps: 0,
    longMarchSteps: 0,
    canExchange: true,
    currentLocation: '未开始',
    nextLocation: '瑞金',
    stepsToNext: 5000
  },

  onLoad() {
    this.getStepData();
  },

  onShow() {
    this.getStepData();
  },

  getStepData() {
    // 获取微信步数
    wx.getWeRunData({
      success: (res) => {
        wx.request({
          url: 'your-backend-url/decode-werun-data',
          method: 'POST',
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: (result) => {
            if (result.data && result.data.stepInfoList) {
              const today = result.data.stepInfoList[result.data.stepInfoList.length - 1];
              this.setData({
                wechatSteps: today.step
              });
            }
          },
          fail: () => {
            // 失败时使用模拟数据
            this.setData({
              wechatSteps: 8070
            });
          }
        });
      },
      fail: () => {
        // 用户未授权或获取失败，使用模拟数据
        this.setData({
          wechatSteps: 8070
        });
      }
    });

    // 获取已有的长征步数
    const longMarchSteps = wx.getStorageSync('longMarchSteps') || 0;
    const todayExchanged = wx.getStorageSync('todayExchanged') || false;
    const exchangeDate = wx.getStorageSync('exchangeDate') || '';
    const today = new Date().toDateString();

    this.setData({
      longMarchSteps: longMarchSteps,
      canExchange: !todayExchanged || exchangeDate !== today,
      currentLocation: this.getCurrentLocation(longMarchSteps)
    });
  },

  getCurrentLocation(steps) {
    if (steps < 5000) return '未开始';
    if (steps < 15000) return '瑞金';
    if (steps < 25000) return '遵义';
    if (steps < 35000) return '泸定';
    if (steps < 50000) return '会宁';
    return '延安';
  },

  exchangeSteps() {
    if (!this.data.canExchange) {
      wx.showToast({
        title: '今日已兑换',
        icon: 'none'
      });
      return;
    }

    if (this.data.wechatSteps === 0) {
      wx.showToast({
        title: '暂无可兑换步数',
        icon: 'none'
      });
      return;
    }

    const newLongMarchSteps = this.data.longMarchSteps + this.data.wechatSteps;
    const today = new Date().toDateString();

    // 保存数据
    wx.setStorageSync('longMarchSteps', newLongMarchSteps);
    wx.setStorageSync('todayExchanged', true);
    wx.setStorageSync('exchangeDate', today);

    this.setData({
      longMarchSteps: newLongMarchSteps,
      canExchange: false,
      currentLocation: this.getCurrentLocation(newLongMarchSteps)
    });

    wx.showToast({
      title: `成功兑换${this.data.wechatSteps}步`,
      icon: 'success'
    });

    // 检查是否解锁新章节
    this.checkUnlockedChapters(newLongMarchSteps);
  },

  checkUnlockedChapters(steps) {
    const milestones = [
      { steps: 5000, name: '瑞金' },
      { steps: 15000, name: '遵义会议' },
      { steps: 25000, name: '飞夺泸定桥' },
      { steps: 35000, name: '爬雪山过草地' },
      { steps: 50000, name: '三军会师' }
    ];

    const oldSteps = this.data.longMarchSteps;
    for (let milestone of milestones) {
      if (oldSteps < milestone.steps && steps >= milestone.steps) {
        wx.showModal({
          title: '恭喜！',
          content: `您已抵达${milestone.name}，解锁了新的章节内容！`,
          showCancel: false,
          confirmText: '去查看',
          success: (res) => {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/chapters/chapters'
              });
            }
          }
        });
        break;
      }
    }
  }
}); 