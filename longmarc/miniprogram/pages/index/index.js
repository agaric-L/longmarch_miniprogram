Page({
  data: {},
  goMap() {
    wx.switchTab({ url: '/pages/map/map' });
  },
  goTimeline() {
    wx.switchTab({ url: '/pages/timeline/timeline' });
  }
}); 