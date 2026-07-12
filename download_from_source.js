import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

const dataFile = fs.readFileSync(path.join(process.cwd(), 'src/data/universidades.js'), 'utf8');

const regex = /id:\s*'([^']+)',[\s\S]*?web:\s*'([^']+)'/g;
const universities = [];
let match;
while ((match = regex.exec(dataFile)) !== null) {
  universities.push({ id: match[1], web: match[2] });
}

const logosDir = path.join(process.cwd(), 'public', 'logos');
const missing = [];

for (const uni of universities) {
  const filepath = path.join(logosDir, `${uni.id}.png`);
  if (!fs.existsSync(filepath)) {
    missing.push(uni);
  } else {
    const stats = fs.statSync(filepath);
    if (stats.size < 2000) {
      missing.push(uni);
    }
  }
}

console.log(`Missing logos to fetch from source: ${missing.length}`);

const fetchHtml = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         let nextUrl = res.headers.location;
         if (!nextUrl.startsWith('http')) {
           const urlObj = new URL(url);
           nextUrl = `${urlObj.protocol}//${urlObj.host}${nextUrl}`;
         }
         fetchHtml(nextUrl).then(resolve).catch(reject);
         return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({html: data, url: url}));
    }).on('error', reject);
  });
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(true));
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         let nextUrl = res.headers.location;
         if (!nextUrl.startsWith('http')) {
           const urlObj = new URL(url);
           nextUrl = `${urlObj.protocol}//${urlObj.host}${nextUrl}`;
         }
         downloadImage(nextUrl, filepath).then(resolve).catch(reject);
      } else {
        res.resume();
        resolve(false);
      }
    }).on('error', reject);
  });
};

async function run() {
  for (const uni of missing) {
    if (!uni.web) continue;
    const filepath = path.join(logosDir, `${uni.id}.png`);
    
    try {
      console.log(`Fetching HTML from ${uni.web} for ${uni.id}...`);
      const { html, url: finalUrl } = await fetchHtml(uni.web);
      
      let imgUrl = null;
      
      // Try to find og:image
      const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogMatch) {
        imgUrl = ogMatch[1];
      }
      
      // Try apple-touch-icon
      if (!imgUrl) {
        const appleMatch = html.match(/<link\s+rel=["'][^"']*apple-touch-icon[^"']*["']\s+href=["']([^"']+)["']/i);
        if (appleMatch) imgUrl = appleMatch[1];
      }
      
      // Try icon/favicon with sizes (usually high res)
      if (!imgUrl) {
        const iconMatch = html.match(/<link\s+rel=["'](?:shortcut )?icon["']\s+[^>]*href=["']([^"']+)["']/i);
        if (iconMatch) imgUrl = iconMatch[1];
      }
      
      // Try to find a logo in the header or navbar
      if (!imgUrl) {
        const logoImgMatch = html.match(/<img[^>]+src=["']([^"']*(?:logo|escudo)[^"']*)["'][^>]*>/i);
        if (logoImgMatch) imgUrl = logoImgMatch[1];
      }

      if (imgUrl) {
        if (!imgUrl.startsWith('http')) {
           const urlObj = new URL(finalUrl);
           if (imgUrl.startsWith('//')) {
             imgUrl = `${urlObj.protocol}${imgUrl}`;
           } else if (imgUrl.startsWith('/')) {
             imgUrl = `${urlObj.protocol}//${urlObj.host}${imgUrl}`;
           } else {
             imgUrl = `${urlObj.protocol}//${urlObj.host}/${imgUrl}`;
           }
        }
        
        console.log(`[DOWNLOAD] Found image for ${uni.id}: ${imgUrl}`);
        const success = await downloadImage(imgUrl, filepath);
        if (success) {
           console.log(`[SUCCESS] Saved ${uni.id}.png`);
        } else {
           console.log(`[FAILED] Could not download image for ${uni.id}`);
        }
      } else {
        console.log(`[FAILED] No logo found in HTML for ${uni.id}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${uni.id}: ${err.message}`);
    }
    
    // Add 1 sec delay to be polite to the university servers
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
