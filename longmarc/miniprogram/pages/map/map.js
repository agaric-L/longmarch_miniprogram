const DEFAULT_CENTER = { latitude: 27.8, longitude: 106.9 };

Page({
  data: {
    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,
    scale: 5,
    satellite: true,
    markers: [],
    polyline: []
  },

  onShow() {
    this.loadCheckpoints();
    const app = getApp();
    if (app && app.globalData && app.globalData.focusPoint) {
      const { latitude, longitude, name, scale } = app.globalData.focusPoint;
      this.setData({ latitude, longitude, scale: scale || 12 }, () => {
        // Try to show callout for the focused marker after setData
        const marker = (this.data.markers || []).find(m => m.name === name);
        if (marker) {
          // Re-set the marker with ALWAYS display to ensure visibility
          const markers = this.data.markers.map(m => m.id === marker.id ? { ...m, callout: { content: `${m.name}`, display: 'ALWAYS' } } : m);
          this.setData({ markers });
          setTimeout(() => {
            // revert callout to BYCLICK after a short while
            const revert = this.data.markers.map(m => m.id === marker.id ? { ...m, callout: { content: `${m.name}`, display: 'BYCLICK' } } : m);
            this.setData({ markers: revert });
          }, 1600);
        }
      });
      app.globalData.focusPoint = null;
    }
  },

  async loadCheckpoints() {
    try {
      wx.showLoading({ title: '加载中' });
      const res = await wx.cloud.callFunction({ name: 'getCheckpoints' });
      const { code, data } = res.result || {};
      if (code === 0 && Array.isArray(data)) {
        const total = parseFloat(wx.getStorageSync('totalMileage') || 0); // km
        const points = data.map(d => ({ latitude: d.latitude, longitude: d.longitude }));
        const polyline = points.length > 1 ? [{ points, color: '#ff2d55', width: 3, dottedLine: false }] : [];
        const reachedCount = this.estimateReachedCount(points, total);
        const markers = data.map((pt, idx) => ({
          id: idx + 1,
          latitude: pt.latitude,
          longitude: pt.longitude,
          title: pt.name,
          width: idx < reachedCount ? 34 : 26,
          height: idx < reachedCount ? 34 : 26,
          iconPath: idx < reachedCount ? '/assets/flag_on.png' : '/assets/flag_off.png',
          callout: { content: `${pt.name}`, display: 'BYCLICK' },
          name: pt.name
        }));
        this.setData({ markers, polyline });
        if (points[0]) {
          this.setData({ latitude: points[0].latitude, longitude: points[0].longitude });
        }
      } else {
        wx.showToast({ title: '数据格式错误', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onMarkerTap(e) {
    const markerId = e.detail && e.detail.markerId;
    const marker = (this.data.markers || []).find(m => m.id === markerId);
    if (marker && marker.name) {
      wx.navigateTo({ url: `/pages/scene/scene?name=${encodeURIComponent(marker.name)}` });
    }
  },

  estimateReachedCount(points, totalKm) {
    if (!points || points.length === 0) return 0;
    let acc = 0;
    for (let i = 1; i < points.length; i++) {
      acc += this.distanceKm(points[i - 1], points[i]);
      if (acc > totalKm) return i;
    }
    return points.length;
  },

  distanceKm(a, b) {
    const toRad = (d) => d * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const la1 = toRad(a.latitude);
    const la2 = toRad(b.latitude);
    const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  },

  toggleSatellite() { this.setData({ satellite: !this.data.satellite }); },

  goChapters() { wx.navigateTo({ url: '/pages/chapters/chapters' }); },
  goTimeline() { wx.navigateTo({ url: '/pages/timeline/timeline' }); },
  goChallenge() { wx.navigateTo({ url: '/pages/challenge/challenge' }); }
}); 