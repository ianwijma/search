const urlTools = require('./urlTools');

class MetaTools {

    extractElasticSearch ( hostname, pathname, search, meta ) {
        const {
            title = '',
            keywords = [],
            description = '',
            h1 = [],
            h2 = [],
            h3 = [],
            h4 = [],
            h5 = [],
            h6 = [],
            links = [],
            images = [],
            content_key_words = [],
            content_key_phrases = [],
            content_summary = '',
        } = meta;

        return {
            url: urlTools.buildPlainUrl( hostname, pathname, search ),
            url_clean: urlTools.buildPlainUrl( hostname, pathname ),
            url_hostname: hostname,
            url_pathname: pathname,
            url_search: search,

            head_title: title,
            head_keywords: keywords,
            head_description: description,

            content_h1: h1,
            content_h2: h2,
            content_h3: h3,
            content_h4: h4,
            content_h5: h5,
            content_h6: h6,
            content_links: links,
            content_images: images,
            content_keywords: content_key_words,
            content_key_phrases: content_key_phrases,
            content_summary: content_summary,
        }

    }



}

module.exports = new MetaTools();