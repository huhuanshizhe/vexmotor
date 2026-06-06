const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const https = require('https');

const TARGET_URL = 'https://www.omc-stepperonline.com';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log('Loading homepage...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Page loaded:', await page.title());

  // Take full page screenshot
  await page.screenshot({ path: '/tmp/omc-homepage.png', fullPage: true });
  console.log('Screenshot saved to /tmp/omc-homepage.png');

  // Extract all images and links from category section
  const categoryImages = await page.evaluate(() => {
    const results = [];
    // Find all images on the page
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const src = img.src || img.getAttribute('data-src') || '';
      const alt = img.alt || '';
      const parent = img.closest('a');
      const href = parent ? parent.href : '';
      if (src && (src.includes('nema') || src.includes('stepper') || src.includes('motor') || src.includes('driver') || src.includes('power') || src.includes('closed') || src.includes('brushless') || src.includes('integrated') || src.includes('bldc') || src.includes('spindle'))) {
        results.push({ src, alt, href });
      }
    });
    return results;
  });

  console.log('\n=== Category Images Found ===');
  categoryImages.forEach((img, i) => {
    console.log(`[${i+1}] alt="${img.alt}" href="${img.href}" src="${img.src}"`);
  });

  // Also look for category links
  const categoryLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/nema"], a[href*="/stepper"], a[href*="/power"], a[href*="/closed"], a[href*="/brushless"], a[href*="/integrated"]');
    return Array.from(links).map(a => ({
      href: a.href,
      text: a.textContent.trim().substring(0, 50),
      imgSrc: a.querySelector('img') ? (a.querySelector('img').src || a.querySelector('img').getAttribute('data-src')) : null
    })).filter(l => l.text.length > 0);
  });

  console.log('\n=== Category Links Found ===');
  const uniqueLinks = [];
  const seen = new Set();
  categoryLinks.forEach(link => {
    if (!seen.has(link.href)) {
      seen.add(link.href);
      uniqueLinks.push(link);
      console.log(`- text="${link.text}" href="${link.href}" img="${link.imgSrc}"`);
    }
  });

  // Download images to d:\vexmotor\public\categories\
  const downloadDir = 'd:\\vexmotor\\public\\categories';
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  // Map categories to slugs
  const slugMap = {
    'nema-8': 'nema-8-stepper-motor',
    'nema-11': 'nema-11-stepper-motor',
    'nema-14': 'nema-14-stepper-motor',
    'nema-16': 'nema-16-stepper-motor',
    'nema-17': 'nema-17-stepper-motor',
    'nema-23': 'nema-23-stepper-motor',
    'nema-24': 'nema-24-stepper-motor',
    'nema-34': 'nema-34-stepper-motor',
    'stepper-motor-driver': 'stepper-motor-driver',
    'power-supply': 'power-supply',
    'closed-loop': 'closed-loop-stepper-motor',
    'brushless-dc': 'brushless-dc-motor',
    'brushless-spindle': 'brushless-spindle-motor',
    'integrated': 'integrated-stepper-motor',
  };

  console.log('\n=== Downloading Images ===');
  for (const link of uniqueLinks) {
    if (!link.imgSrc) continue;
    
    let slug = null;
    for (const [key, value] of Object.entries(slugMap)) {
      if (link.href.toLowerCase().includes(key) || link.text.toLowerCase().includes(key.replace('-', ' '))) {
        slug = value;
        break;
      }
    }
    
    if (!slug) continue;
    if (seen.has('downloaded-' + slug)) continue;
    seen.add('downloaded-' + slug);

    const filename = slug + '.png';
    const filepath = path.join(downloadDir, filename);
    
    console.log(`Downloading ${slug} from ${link.imgSrc}`);
    try {
      const response = await page.request.get(link.imgSrc);
      const buffer = await response.body();
      fs.writeFileSync(filepath, buffer);
      console.log(`  -> Saved ${filename} (${buffer.length} bytes)`);
    } catch (e) {
      console.log(`  -> FAILED: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nDone!');
})();
