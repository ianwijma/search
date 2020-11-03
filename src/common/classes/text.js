const retext = require('retext');
const pos = require('retext-pos');
const keywords = require('retext-keywords');
const toString = require('nlcst-to-string');
const vfile = require('vfile');

module.exports = class Text {

    constructor( content ) {
        this.content;
    }

    getVFile() {
        if ( !this.vfile ) {
            this.vfile = vfile( Buffer.from( this.content ) );
        }

        return this.vfile;
    }

    getKeywords ( maximum = 25 ) {
        return new Promise(resolve => {
            const done = (err, file) => {
                file.data.keywords.forEach(function(keyword) {
                    resolve( toString(keyword.matches[0].node) );
                })
            }

            retext()
                .use(pos)
                .use(keywords, { maximum })
                .process(this.getVFile(), done);
        });
    }

    getKeyPhrases ( maximum = 25 ) {
        return new Promise(resolve => {
            const done = (err, file) => {
                file.data.keyphrases.forEach(function(phrase) {
                    resolve( phrase.matches[0].nodes.map(stringify).join('') )
                    function stringify(value) {
                        return toString(value)
                    }
                })
            }

            retext()
                .use(pos)
                .use(keywords, { maximum })
                .process(this.getVFile(), done);
        });
    }

}