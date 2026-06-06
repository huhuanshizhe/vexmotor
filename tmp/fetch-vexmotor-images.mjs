const response = await fetch('https://www.vexmotor.com/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
});
const html = await response.text();

// Find all image URLs
const imgRegex = /(?:src|data-src|srcset|content)=['"]([^'"]*\.(?:jpg|png|webp|gif)[^'"]*)['"]/gi;
const matches = [...html.matchAll(imgRegex)];
const urls = [...new Set(matches.map(m => m[1]))];

console.log(`Found ${urls.length} image URLs\n`);
urls.sort();
urls.forEach(u => console.log(u));

// Also find background-image URLs
const bgRegex = /url\(['"]?([^'")]*\.(?:jpg|png|webp)[^'"]*)['"]?\)/gi;
const bgMatches = [...html.matchAll(bgRegex)];
const bgUrls = [...new Set(bgMatches.map(m => m[1]))];
if (bgUrls.length) {
  console.log(`\n=== Background images (${bgUrls.length}) ===`);
  bgUrls.forEach(u => console.log(u));
}
