// Cloud function to decode WeRun data
exports.main = async (event, context) => {
  try {
    const { weRunData } = event || {};
    // After deployment, the platform will resolve CloudID and inject real data to 'weRunData' field
    // Docs: https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/openapi.html
    if (!weRunData || !weRunData.data) {
      return { code: 1, message: 'No WeRun data' };
    }
    return { code: 0, data: weRunData.data };
  } catch (e) {
    console.error(e);
    return { code: 2, message: 'Server error' };
  }
}; 