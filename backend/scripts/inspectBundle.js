const fs = require('fs');

async function inspectLiveBundle() {
  try {
    console.log('Fetching live Vercel frontend index HTML...');
    const htmlRes = await fetch('https://nestcares-in.vercel.app/');
    const html = await htmlRes.text();
    const jsMatches = Array.from(html.matchAll(/src=["'](\/assets\/index-.*?\.js)["']/g));
    if (!jsMatches || jsMatches.length === 0) {
      console.log('No JS bundle matches found in HTML:', html);
      return;
    }
    for (const match of jsMatches) {
      const jsUrl = 'https://nestcares-in.vercel.app' + match[1];
      console.log('Fetching JS Bundle:', jsUrl);
      const jsRes = await fetch(jsUrl);
      const jsText = await jsRes.text();
      const apiMatches = jsText.match(/https?:\/\/[^\s"'`}]+/g) || [];
      const filtered = apiMatches.filter(u => u.includes('onrender') || u.includes('api') || u.includes('backend') || u.includes('vercel'));
      console.log('Found URLs in ' + match[1] + ':', Array.from(new Set(filtered)));
    }
  } catch (e) {
    console.error('Error inspecting bundle:', e.message);
  }
}

inspectLiveBundle();
