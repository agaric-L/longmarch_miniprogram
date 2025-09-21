const STEPS_TO_KM = 0.0006; // 1 step ~ 0.6 meters

Page({
  data: {
    hasData: false,
    todaySteps: 0,
    mileage: 0
  },

  async onGetWeRun(e) {
    try {
      const { cloudID } = e.detail || {};
      if (!cloudID) {
        wx.showToast({ title: '未授权或无数据', icon: 'none' });
        return;
      }
      wx.showLoading({ title: '解析中' });
      const res = await wx.cloud.callFunction({ name: 'getWeRunSteps', data: { weRunData: wx.cloud.CloudID(cloudID) } });
      const { code, data, message } = res.result || {};
      if (code === 0 && data && Array.isArray(data.stepInfoList)) {
        const today = this.pickTodaySteps(data.stepInfoList);
        const mileage = (today * STEPS_TO_KM).toFixed(2);
        this.setData({ hasData: true, todaySteps: today, mileage });
      } else {
        wx.showToast({ title: message || '解析失败', icon: 'none' });
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '获取失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  pickTodaySteps(stepInfoList) {
    const todayTs = new Date();
    const startOfDay = new Date(todayTs.getFullYear(), todayTs.getMonth(), todayTs.getDate()).getTime() / 1000;
    let latest = 0;
    stepInfoList.forEach(item => {
      if (item.timestamp >= startOfDay) {
        latest = Math.max(latest, item.step);
      }
    });
    return latest;
  },

  applyMileage() {
    const add = parseFloat(this.data.mileage || 0);
    try {
      const old = parseFloat(wx.getStorageSync('totalMileage') || 0);
      const total = (old + add).toFixed(2);
      wx.setStorageSync('totalMileage', total);
      wx.showToast({ title: '已累计 ' + total + ' 公里', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '存储失败', icon: 'none' });
    }
  }
}); 