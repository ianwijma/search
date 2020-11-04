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

const { SummarizerManager } = require('node-summarizer');

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
                const data = [];
                file.data.keywords.forEach(function(keyword) {
                    data.push( toString(keyword.matches[0].node) );
                });
                resolve( data );
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
                const data = [];
                file.data.keyphrases.forEach(function(phrase) {
                    data.push(
                        phrase.matches[0].nodes.map(stringify).join('')
                    )
                });
                resolve( data )
            }
            function stringify(value) {
                return toString(value)
            }

            retext()
                .use(this.getRetextLanguage())
                .use(pos)
                .use(keywords, { maximum })
                .process(this.getVFile(), done);
        });
    }

    getSummary ( sentences = 10 ) {
        return new Promise((resolve, reject) => {
            const Summarizer = new SummarizerManager(this.content, sentences);
            const { summary } = Summarizer.getSummaryByFrequency()
            resolve( summary );
        })
    }

}