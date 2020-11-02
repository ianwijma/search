const { launch } = require('puppeteer');

module.export = class Browser {

    async _getBrowser( options = {} ) {
        return await launch({
            ...options
        });
    }

    async _ensureBrowser() {
        if ( !this.b ) {
            this.b = await this._getBrowser();
        }
    }

    async getPageHtml( url ) {
        await this._ensureBrowser();

        
    }

}