export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const canonicalPath = url.pathname.replace(/^\/archive\/{2,}(\d{4}-\d{2}-\d{2})\/?$/, '/archive/$1/');
    if (url.hostname === 'www.farflungclues.com' || canonicalPath !== url.pathname) {
      if (url.hostname === 'www.farflungclues.com') {
        url.hostname = 'farflungclues.com';
        url.protocol = 'https:';
      }
      url.pathname = canonicalPath;
      return Response.redirect(url, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
