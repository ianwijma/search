class UrlTools {

    buildPlainUrl (  hostname, pathname = '', search = ''  ) {
        if (pathname.startsWith('/')) pathname = pathname.substring(1);
        if (search.startsWith('?')) search = search.substring(1);

        pathname = pathname.trim();
        search = search.trim();

        let url = `${hostname}`;
        if (!!pathname) url = `${url}/${pathname}`;
        if (!!search) url = `${url}?${search}`;
        return url;
    }

    buildUrl (  hostname, pathname = '', search = ''  ) {
        const plainUrl = this.buildPlainUrl( hostname, pathname, search );
        return `https://${plainUrl}`;
    }

    getURL ( hostname, pathname = '', search = '' ) {
        const url = this.buildUrl( hostname, pathname, search );
        return new URL( url );
    }

}

module.exports = new UrlTools();