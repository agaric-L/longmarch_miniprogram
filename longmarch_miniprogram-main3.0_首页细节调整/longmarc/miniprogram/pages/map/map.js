const DEFAULT_CENTER = { latitude: 27.8, longitude: 106.9 };

Page({
  data: {
    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,
    scale: 5,
    satellite: true,
    markers: [],
    polyline: [],
    // 新增步数相关数据
    todaySteps: 0,
    todayDistance: 0,
    totalSteps: 0,
    currentLocation: '瑞金',
    nextDestination: '血战湘江',
    progressPercent: 0
  },

  onShow() {
    this.loadCheckpoints();
    this.loadStepData();
    const app = getApp();
    if (app && app.globalData && app.globalData.focusPoint) {
      const { latitude, longitude, name, scale } = app.globalData.focusPoint;
      this.setData({ latitude, longitude, scale: scale || 12 }, () => {
        const marker = (this.data.markers || []).find(m => m.name === name);
        if (marker) {
          const markers = this.data.markers.map(m => m.id === marker.id ? { ...m, callout: { content: `${m.name}`, display: 'ALWAYS' } } : m);
          this.setData({ markers });
          setTimeout(() => {
            const revert = this.data.markers.map(m => m.id === marker.id ? { ...m, callout: { content: `${m.name}`, display: 'BYCLICK' } } : m);
            this.setData({ markers: revert });
          }, 1600);
        }
      });
      app.globalData.focusPoint = null;
    }
  },

 loadStepData() {
  // 获取长征步数和计算距离
  const longMarchSteps = wx.getStorageSync('longMarchSteps') || 0;
  const todaySteps = 8070; // 可以从首页获取今日步数
  const todayDistance = (todaySteps * 0.6 / 1000).toFixed(2); // 假设每步0.6米
  
  // 修改这里：使用总步数而不是长征步数来计算累计行走距离
  const totalSteps = wx.getStorageSync('totalSteps') || 0; // 获取总步数
  const totalDistance = (totalSteps * 0.6 / 1000).toFixed(2); // 用总步数计算累计距离
  
  // 计算当前段落的进度百分比
  const { currentLocation, nextDestination, progressPercent } = this.calculateProgress(longMarchSteps);
  
  this.setData({
    todaySteps: todaySteps,
    todayDistance: todayDistance,
    totalSteps: longMarchSteps, // 这里保持长征步数用于进度计算
    totalDistance: totalDistance, // 这里使用总步数计算的距离
    currentLocation: currentLocation,
    nextDestination: nextDestination,
    progressPercent: progressPercent
  });
},
  calculateProgress(steps) {
    // 定义长征路线节点
    const destinations = [
      { name: '瑞金', minSteps: 0, maxSteps: 5000 },
      { name: '血战湘江', minSteps: 5000, maxSteps: 15000 },
      { name: '遵义会议', minSteps: 15000, maxSteps: 25000 },
      { name: '飞夺泸定桥', minSteps: 25000, maxSteps: 35000 },
      { name: '爬雪山过草地', minSteps: 35000, maxSteps: 50000 },
      { name: '三军会师', minSteps: 50000, maxSteps: 60000 }
    ];

    // 找到当前所在段落
    let currentIndex = 0;
    for (let i = 0; i < destinations.length - 1; i++) {
      if (steps >= destinations[i].minSteps && steps < destinations[i + 1].minSteps) {
        currentIndex = i;
        break;
      }
    }

    // 如果超过最后一个节点，显示最后一段
    if (steps >= destinations[destinations.length - 1].minSteps) {
      currentIndex = destinations.length - 2;
    }

    const currentLocation = destinations[currentIndex].name;
    const nextDestination = destinations[currentIndex + 1] ? destinations[currentIndex + 1].name : '胜利会师';
    
    // 计算当前段落的进度百分比
    const segmentStart = destinations[currentIndex].minSteps;
    const segmentEnd = destinations[currentIndex + 1] ? destinations[currentIndex + 1].minSteps : destinations[currentIndex].maxSteps;
    const segmentProgress = Math.max(0, Math.min(100, ((steps - segmentStart) / (segmentEnd - segmentStart)) * 100));

    return {
      currentLocation,
      nextDestination,
      progressPercent: segmentProgress
    };
  },

  onMarkerTap(e) {
    const markerId = e.detail && e.detail.markerId;
    const marker = (this.data.markers || []).find(m => m.id === markerId);
    
    if (marker && marker.name) {
      // 检查是否已解锁该章节
      const longMarchSteps = wx.getStorageSync('longMarchSteps') || 0;
      const requiredSteps = this.getRequiredSteps(marker.name);
      
      if (longMarchSteps < requiredSteps) {
        wx.showModal({
          title: '章节未解锁',
          content: `需要${requiredSteps}步才能解锁${marker.name}章节`,
          showCancel: false
        });
        return;
      }
      
      if (marker.name === '瑞金出发') {
        wx.navigateTo({ url: '/pages/scene_rj/scene_rj' });
      } else {
        wx.navigateTo({ url: `/pages/scene/scene?name=${encodeURIComponent(marker.name)}` });
      }
    }
  },

  getRequiredSteps(locationName) {
    const requirements = {
      '瑞金出发': 0,
      '遵义会议': 15000,
      '飞夺泸定桥': 25000,
      '爬雪山过草地': 35000,
      '三军会师': 50000
    };
    return requirements[locationName] || 0;
  },
  
  async loadCheckpoints() {
    try {
      wx.showLoading({ title: '加载中' });
      const res = await wx.cloud.callFunction({ name: 'getCheckpoints' });
      const { code, data } = res.result || {};
      if (code === 0 && Array.isArray(data)) {
        const longMarchSteps = wx.getStorageSync('longMarchSteps') || 0;
        const points = data.map(d => ({ latitude: d.latitude, longitude: d.longitude }));
        const polyline = points.length > 1 ? [{ points, color: '#ff2d55', width: 3, dottedLine: false }] : [];
        const reachedCount = this.estimateReachedCount(points, longMarchSteps);
        const markers = data.map((pt, idx) => ({
          id: idx + 1,
          latitude: pt.latitude,
          longitude: pt.longitude,
          title: pt.name,
          width: idx < reachedCount ? 34 : 26,
          height: idx < reachedCount ? 34 : 26,
          callout: { content: `${pt.name}`, display: 'BYCLICK' },
          name: pt.name,
          iconPath: idx < reachedCount ? '/images/marker-reached.png' : '/images/marker-locked.png'
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

  estimateReachedCount(points, totalSteps) {
    // 根据步数估算到达的点位数量
    if (totalSteps < 5000) return 1;
    if (totalSteps < 15000) return 2;
    if (totalSteps < 25000) return 3;
    if (totalSteps < 35000) return 4;
    if (totalSteps < 50000) return 5;
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

  toggleSatellite() { 
    this.setData({ satellite: !this.data.satellite }); 
  }
});