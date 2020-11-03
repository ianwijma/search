class UrlTools {

    buildUrl (  hostname, pathname = '', search = ''  ) {
        if (pathname.startsWith('/')) pathname = pathname.substring(1);
        if (search.startsWith('?')) search = search.substring(1);

        pathname = pathname.trim();
        search = search.trim();

        let url = `https://${hostname}`;
        if (!!pathname) url = `${url}/${pathname}`;
        if (!!search) url = `${url}?${search}`;
        return url;
    }

    getURL ( hostname, pathname = '', search = '' ) {
        const url = this.buildUrl( hostname, pathname, search );
        return new URL( url );
    }

}

module.exports = new UrlTools();