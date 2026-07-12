import fs from 'fs';
import https from 'https';
import path from 'path';

// Regex to extract all { id: '...', ..., web: '...' } objects
const dataFile = fs.readFileSync(path.join(process.cwd(), 'src/data/universidades.js'), 'utf8');

const regex = /id:\s*'([^']+)',[\s\S]*?web:\s*'([^']+)'/g;
const universities = [];
let match;
while ((match = regex.exec(dataFile)) !== null) {
  universities.push({ id: match[1], web: match[2] });
}

console.log(`Found ${universities.length} universities.`);

const logosDir = path.join(process.cwd(), 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const getDomain = (webUrl) => {
  try { return new URL(webUrl).hostname.replace('www.', ''); }
  catch { return ''; }
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(true));
      } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
         // Follow redirect
         downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else {
        res.resume();
        resolve(false); // No logo
      }
    }).on('error', reject);
  });
};

async function run() {
  for (const uni of universities) {
    const domain = getDomain(uni.web);
    if (!domain) continue;
    
    const filepath = path.join(logosDir, `${uni.id}.png`);
    if (fs.existsSync(filepath)) {
      console.log(`[SKIP] ${uni.id} already exists`);
      continue;
    }

    // Try clearbit first
    let success = false;
    const sources = [
      `https://logo.clearbit.com/${domain}?size=256`,
      `https://unavatar.io/${domain}?fallback=false`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
    ];

    for (const source of sources) {
      try {
        console.log(`[DOWNLOAD] Trying ${source} for ${uni.id}...`);
        const res = await downloadImage(source, filepath);
        if (res) {
          // Check if file is essentially empty or too small (e.g., globe icon from google)
          const stats = fs.statSync(filepath);
          if (stats.size < 1000) { // arbitrary small size for invalid/globe icons
             console.log(`[WARN] File too small for ${uni.id}, might be default globe.`);
             // Let's keep trying other sources if possible
          } else {
             success = true;
             console.log(`[SUCCESS] Downloaded ${uni.id} from ${source}`);
             break;
          }
        }
      } catch (err) {
        console.error(`[ERROR] ${uni.id} on ${source}: ${err.message}`);
      }
    }
    if (!success) {
      console.log(`[FAILED] Could not get a good logo for ${uni.id}`);
    }
    
    // throttle
    await new Promise(r => setTimeout(r, 500));
  }
}

run();
