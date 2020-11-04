(async function () {
    try {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const contact = await browser.createIncognitoBrowserContext();
        const page = await contact.newPage();
        await page.goto( 'https://ian.wij.ma/ianwijma-resume.pdf' );
    } catch ( err ) {
        console.error( err );
    }
})();