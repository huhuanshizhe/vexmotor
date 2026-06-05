const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://stepmotech.online', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log('✅ Page loaded:', await page.title());

    // Scroll to footer
    await page.evaluate(() => {
      const footer = document.querySelector('.storefront-footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: '/tmp/stepmotech-footer-full.png',
      fullPage: true,
    });
    console.log('📸 Full page screenshot saved to /tmp/stepmotech-footer-full.png');

    // Take footer-specific screenshot
    const footer = await page.locator('.storefront-footer');
    if (await footer.count() > 0) {
      await footer.screenshot({
        path: '/tmp/stepmotech-footer-only.png',
      });
      console.log('📸 Footer-only screenshot saved to /tmp/stepmotech-footer-only.png');
    } else {
      console.log('⚠️ Footer element not found');
    }

    // Get footer HTML structure
    const footerHTML = await page.evaluate(() => {
      const footer = document.querySelector('.storefront-footer');
      return footer ? footer.outerHTML.substring(0, 2000) + '...' : 'Footer not found';
    });
    console.log('\n📄 Footer HTML structure:');
    console.log(footerHTML);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
