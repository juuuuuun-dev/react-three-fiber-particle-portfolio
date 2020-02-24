const getDevice = () => {
  const ua = navigator.userAgent;
  if (
    (ua.indexOf('iPhone') !== -1 ||
      ua.indexOf('iPod') !== -1 ||
      (ua.indexOf('Android') !== -1) && ua.indexOf('Mobile') !== -1)
  ) {
    return 'sp';
  } else if (ua.indexOf('iPad') !== -1 || ua.indexOf('Android') !== -1) {
    return 'tablet';
  } else {
    return 'pc';
  }
};

export { getDevice };
