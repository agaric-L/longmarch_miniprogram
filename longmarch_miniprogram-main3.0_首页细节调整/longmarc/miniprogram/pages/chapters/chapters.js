Page({
  data: {
    loading: true,
    chapters: {
      start: [],
      turn: [],
      difficult: [],
      end: []
    }
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    try {
      const res = await wx.cloud.callFunction({ name: 'getCheckpoints' });
      const { code, data } = res.result || {};
      if (code === 0 && Array.isArray(data)) {
        const byName = (name) => data.find(d => d.name.indexOf(name) >= 0);
        const start = [
          byName('瑞金出发'),
          byName('湘江')
        ].filter(Boolean);
        const turn = [
          byName('遵义会议'),
          byName('四渡赤水')
        ].filter(Boolean);
        const difficult = [
          byName('强渡大渡河'),
          byName('飞夺泸定桥'),
          byName('翻越夹金山')
        ].filter(Boolean);
        const end = [
          byName('腊子口'),
          byName('会宁会师')
        ].filter(Boolean);
        this.setData({ chapters: { start, turn, difficult, end } });
      } else {
        wx.showToast({ title: '数据错误', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  openOnMap(e) {
    const { latitude, longitude, name } = e.currentTarget.dataset;
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.focusPoint = { latitude, longitude, name, scale: 13 };
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/pages/map/map' });
    }
  },

  goSceneruijin(){
    wx.navigateTo({
      url: '/pages/scene_rj/scene_rj', // 跳转到 scene_rj 页面
    });
  },

  goScene(e) {
    const { name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/scene/scene?name=${encodeURIComponent(name)}` });
  },

  goTimeline() {
    wx.navigateTo({ url: '/pages/timeline/timeline' });
  }
}); 