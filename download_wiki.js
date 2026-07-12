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

console.log(`Found ${universities.length} universities.`);

const logosDir = path.join(process.cwd(), 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const getJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
    
    // Check if we already have a valid file
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 2000) { // If it's larger than 2KB, it's likely a real logo, not a globe
        console.log(`[SKIP] ${uni.id} already exists with size ${stats.size}`);
        continue;
      }
    }

    try {
      const title = encodeURIComponent(uni.nombre.replace(/ /g, '_'));
      const url = `https://es.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${title}&format=json&pithumbsize=256`;
      
      const json = await getJson(url);
      const pages = json.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        const imageUrl = pages[pageId].thumbnail.source;
        console.log(`[WIKI] Found image for ${uni.nombre}: ${imageUrl}`);
        await downloadImage(imageUrl, filepath);
      } else {
        console.log(`[WIKI] No thumbnail for ${uni.nombre}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${uni.id}: ${err.message}`);
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
}

run();
