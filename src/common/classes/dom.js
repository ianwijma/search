const { JSDOM } = require('jsdom');

module.exports = class Dom {

    constructor( html ) {
        this.d = new JSDOM( html );
    }

    getDocument() {
        return this.d.window.document;
    }

    getLang() {
        return this.getHtml().lang;
    }

    getHtml() {
        return this.getDocument().querySelector('html');
    }

    getHead() {
        return this.getDocument().querySelector('head');
    }

    getBody() {
        return this.getDocument().querySelector('body');
    }

    elementGetText(element ) {
        if ( 'textContent' in element )
            return element.textContent.trim();
    }

    elementGetAttribute( element, attributeName ) {
        if ( 'getAttribute' in element ) {
            let value = element.getAttribute( attributeName );
            if ( typeof value === 'string' ) value = value.trim();
            return value;
        }
    }

    elementQuery ( element, query ) {
        if ( 'querySelector' in element )
            return element.querySelector( query );
    }

    elementQueryAll ( element, query ) {
        if ( 'querySelector' in element )
            return element.querySelectorAll( query );
    }

    queryText (parentElement, query ) {
        const element = this.elementQuery( parentElement, query );
        if ( element )
            return this.elementGetText( element );
    }

    queryAllText (parentElement, query ) {
        const array = [];

        const elements = this.elementQueryAll( parentElement, query );
        if ( elements && elements.length > 0 ) {
            elements.forEach( element => {
                const data = this.elementGetText( element );
                if ( !!data ) array.push( data );
            });
        }

        return array;
    }

    queryAttribute ( parentElement, query, attributeName ) {
        const element = this.elementQuery( parentElement, query );
        if ( element )
            return this.elementGetAttribute( element, attributeName );
    }

    queryAllAttribute ( parentElement, query, attributeName ) {
        const array = [];

        const elements = this.elementQueryAll( parentElement, query );
        if ( elements && elements.length > 0 ) {
            elements.forEach( element => {
                const data = this.elementGetAttribute( element, attributeName );
                if ( !!data ) array.push( data );
            });
        }

        return array;
    }

    queryLinks ( parentElement ) {
        const links = [];

        const aTags = this.elementQueryAll( parentElement, 'a' );
        aTags && aTags.forEach(({ href, textContent }) => {
            links.push({
                link: href,
                label: textContent
            })
        });

        return links;
    }

    queryImages ( parentElement ) {
        const images = [];
        const iPush = ( src = '', alt = '' ) => images.push({ source: src.trim(), label: alt.trim() });
        const imageElements = this.elementQueryAll( parentElement, 'img' );
        const backgroundImageElements = this.elementQueryAll( parentElement, '[style*=\'background-image\']' );
        const backgroundImageRegex = /url\("(.*)"\)/;

        imageElements.forEach( ({ src, alt }) => iPush( src, alt ));
        backgroundImageElements.forEach( ({ style }) => {
            const backgroundImage = style.backgroundImage;
            if (backgroundImageRegex.test( backgroundImage )) {
                const [ url ] = backgroundImageRegex.exec( backgroundImage );
                iPush( url );
            }
        });

        return images;
    }

}