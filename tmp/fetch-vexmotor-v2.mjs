import { writeFileSync } from 'fs';

async function main() {
  console.log('Fetching vexmotor.com homepage...');
  const response = await fetch('https://www.vexmotor.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  
  if (!response.ok) {
    console.error('Failed:', response.status);
    return;
  }
  
  const html = await response.text();
  console.log('HTML length:', html.length);
  
  // Save HTML for inspection
  writeFileSync('d:/vexmotor/tmp/vexmotor-homepage.html', html);
  console.log('Saved HTML to tmp/vexmotor-homepage.html');
  
  // Find all image URLs
  const imgRegex = /(?:src|data-src|srcset|content)=['"]([^'"]*\.(?:jpg|png|webp|gif)[^'"]*)['"]/gi;
  const matches = [...html.matchAll(imgRegex)];
  const urls = [...new Set(matches.map(m => m[1]))];
  
  console.log(`\nFound ${urls.length} image URLs:`);
  urls.sort().forEach(u => console.log(u));
  
  // Background images
  const bgRegex = /url\(['"]?([^'")]*\.(?:jpg|png|webp)[^'"]*)['"]?\)/gi;
  const bgMatches = [...html.matchAll(bgRegex)];
  const bgUrls = [...new Set(bgMatches.map(m => m[1]))];
  if (bgUrls.length) {
    console.log(`\n=== Background images (${bgUrls.length}) ===`);
    bgUrls.forEach(u => console.log(u));
  }
}

main().catch(console.error);
