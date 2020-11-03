const { JSDOM } = require('jsdom');

module.exports = class Dom {

    constructor( html ) {
        this.d = new JSDOM( html );
    }

    getDocument() {
        return this.d.window.document;
    }

    getHead() {
        return this.getDocument().querySelector('head');
    }

    getBody() {
        return this.getDocument().querySelector('head');
    }

    elementGetInnerText( element ) {
        if ( 'innerText' in element )
            return element.innerText;
    }

    elementGetAttribute( element, attributeName ) {
        if ( 'getAttribute' in element )
            return element.getAttribute( attributeName );
    }

    elementQuery ( element, query ) {
        if ( 'querySelector' in element )
            return element.querySelector( query );
    }

    elementQueryAll ( element, query ) {
        if ( 'querySelector' in element )
            return element.querySelector( query );
    }

    queryInnerText ( parentElement, query ) {
        const element = this.elementQuery( parentElement, query );
        if ( element )
            return this.elementGetInnerText( element );
    }

    queryAllInnerText ( parentElement, query ) {
        const array = [];

        const elements = this.elementQueryAll( parentElement, query );
        if ( elements && elements.length > 0 ) {
            elements.forEach( element => {
                const data = this.elementGetInnerText( element );
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
        aTags.forEach(({ href, innerText }) => {
            links.push({
                link: href,
                label: innerText
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