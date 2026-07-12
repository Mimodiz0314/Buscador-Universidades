import fs from 'fs';
import https from 'https';
import path from 'path';

const dataFile = fs.readFileSync(path.join(process.cwd(), 'src/data/universidades.js'), 'utf8');

const regex = /id:\s*'([^']+)',\s*nombre:\s*'([^']+)'/g;
const universities = [];
let match;
while ((match = regex.exec(dataFile)) !== null) {
  universities.push({ id: match[1], nombre: match[2] });
}

const logosDir = path.join(process.cwd(), 'public', 'logos');

const getJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429 || data.startsWith('<')) {
          console.error(`Rate limited or HTML returned for ${url}: ${data.substring(0, 50)}`);
          reject(new Error('Rate Limited or Invalid JSON'));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(true));
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else {
        res.resume();
        resolve(false);
      }
    }).on('error', reject);
  });
};

async function run() {
  for (const uni of universities) {
    const filepath = path.join(logosDir, `${uni.id}.png`);
    
    let isMissing = false;
    if (!fs.existsSync(filepath)) {
      isMissing = true;
    } else {
      const stats = fs.statSync(filepath);
      if (stats.size < 2000) {
        isMissing = true;
      }
    }

    if (!isMissing) continue;

    try {
      // First search wikipedia to get the correct page title
      const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(uni.nombre)}&utf8=&format=json`;
      const searchJson = await getJson(searchUrl);
      
      if (searchJson.query && searchJson.query.search && searchJson.query.search.length > 0) {
        const title = searchJson.query.search[0].title;
        console.log(`[WIKI] Found title for ${uni.nombre}: ${title}`);
        
        const imgUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=500`;
        const imgJson = await getJson(imgUrl);
        const pages = imgJson.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].thumbnail) {
          const imageUrl = pages[pageId].thumbnail.source;
          console.log(`[DOWNLOAD] ${uni.nombre}: ${imageUrl}`);
          await downloadImage(imageUrl, filepath);
        } else {
          console.log(`[WIKI] No thumbnail on page for ${uni.nombre}`);
        }
      } else {
        console.log(`[WIKI] No search results for ${uni.nombre}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${uni.id}: ${err.message}`);
    }
    
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
