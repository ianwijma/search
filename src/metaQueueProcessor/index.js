const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const database = require('../common/utilities/database');
const urlTools = require('../common/utilities/urlTools');
const { QUEUE_META } = require('../common/constants/redis');
const { PAGE_METADATA } = require('../common/constants/elasticSearch');
const { Client } = require('@elastic/elasticsearch');


class MetaQueueProcessor extends Runner {

    setup () {
        database.ensureConnection();
        this.redis = new Redis();
        this.metaWorker = workerTools.getWorker( QUEUE_META, {
            redis: this.redis.getClient()
        });
        this.elasticSearch = new Client({ node: 'http://localhost:9200' });
    }

    run () {
        const { metaWorker, elasticSearch } = this;
        workerTools.receiveData( metaWorker, async ({ data }) => {
            const {
                hostname,
                pathname = '',
                search = '',
                meta = {},
            } = data;
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

            await elasticSearch.index({
                index: PAGE_METADATA,
                body: {
                    url: urlTools.buildPlainUrl( hostname, pathname, search ),
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
            });
        });
    }

}

(new MetaQueueProcessor()).start();