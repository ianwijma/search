// Retext dependencies
const retext = require('retext');
const pos = require('retext-pos');
const keywords = require('retext-keywords');
const toString = require('nlcst-to-string');
const vfile = require('vfile');

// Languages for retext
const English = require('retext-english');
const Dutch = require('retext-dutch');
const Latin = require('retext-latin');

// Detector
const LanguageDetect = require('languagedetect');

const SummaryTool = require('node-summary');

module.exports = class Text {

    constructor( content ) {
        this.content = content;
    }

    getLanguage () {
        if ( !this.language ) {
            const detector = new LanguageDetect();
            const results = detector.detect( this.content );
            const result = results[0];
            if (result) {
                this.language = result[0];
            }
        }

        return this.language;
    }

    getVFile() {
        if ( !this.vfile ) {
            this.vfile = vfile( Buffer.from( this.content ) );
        }

        return this.vfile;
    }

    getRetextLanguage() {
        const language = this.getLanguage();
        switch ( language ) {
            case 'dutch':
                return Dutch;
            case 'latin':
                return Latin;
            case 'english':
            default:
                return English;
        }
    }

    getKeyWords ( maximum = 25 ) {
        return new Promise(resolve => {
            const done = (err, file) => {
                file.data.keywords.forEach(function(keyword) {
                    resolve( toString(keyword.matches[0].node) );
                })
            }

            retext()
                .use(this.getRetextLanguage())
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
                .use(this.getRetextLanguage())
                .use(pos)
                .use(keywords, { maximum })
                .process(this.getVFile(), done);
        });
    }

    getSummary ( title ) {
        return new Promise((resolve, reject) => {
            SummaryTool.summarize(title, this.content, (err, summary) => {
                err
                    ? reject( err )
                    : resolve( summary);
            })
        })
    }

}