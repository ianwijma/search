const Runner = require('../common/classes/runner');
const Redis = require('../common/classes/redis');
const workerTools = require('../common/utilities/workerTools');
const urlTools = require('../common/utilities/urlTools');
const { QUEUE_PROCESSED_SITES } = require('../common/constants/redis');
const { SITE_METADATA } = require('../common/constants/elasticSearch');
const SiteMetaData = require('../common/models/siteMetaData');
const { Client } = require('@elastic/elasticsearch');
const { sortBy, each, map, slice } = require('lodash');

class ElasticSearchProcessor extends Runner {

    setup () {
        this.redis = new Redis();
        this.processedSiteWorker = workerTools.getWorker( QUEUE_PROCESSED_SITES, {
            redis: this.redis.getClient()
        });
        this.elasticSearch = new Client({ node: 'http://localhost:9200' });
    }

    run () {
        const { processedSiteWorker } = this;
        workerTools.receiveData( processedSiteWorker, async ({ data: hostname }) => {
            const siteData = {
                hostname,
                url: {},
                url_clean: {},
                pathname: {},
                search: {},

                keyword: {},
                title: {},
                description: {},
                h1: {},
                h2: {},
                h3: {},
                h4: {},
                h5: {},
                h6: {},
                link_url: {},
                link_label: {},
                image_url: {},
                image_label: {},
                content_keyword: {},
                content_keyphrase: {},
                content_summary: {},
            };
            const cursor = await SiteMetaData.find({ hostname }).cursor();
            for ( let model = await cursor.next(); model != null; model = await cursor.next() ) {
                this.mergeSiteData( siteData, model.toJSON() );
            }
            const rankedSiteData = this.rankSiteData( siteData );
            await this.pushElasticSearch( hostname, rankedSiteData );
        });
    }

    mergeSiteData ( siteData, modelData ) {
        const {
            hostname, pathname, search, meta
        } = modelData;

        this.mergeString( urlTools.buildPlainUrl( hostname, pathname, search ), siteData.url );
        this.mergeString( urlTools.buildPlainUrl( hostname, pathname ), siteData.url_clean );
        this.mergeString( pathname, siteData.pathname );
        this.mergeString( search, siteData.search );

        this.mergeCollection( meta.links, 'link', siteData.link_url );
        this.mergeCollection( meta.links, 'label', siteData.link_label );

        this.mergeCollection( meta.images, 'source', siteData.image_url );
        this.mergeCollection( meta.images, 'label', siteData.image_label );

        this.mergeArray( meta.keywords, siteData.keyword );
        this.mergeArray( meta.h1, siteData.h1 );
        this.mergeArray( meta.h2, siteData.h2 );
        this.mergeArray( meta.h3, siteData.h3 );
        this.mergeArray( meta.h4, siteData.h4 );
        this.mergeArray( meta.h5, siteData.h5 );
        this.mergeArray( meta.h6, siteData.h6 );
        this.mergeArray( meta.content_keywords, siteData.content_keyword );
        this.mergeArray( meta.content_keyphrases, siteData.content_keyphrase );

        this.mergeString( meta.title, siteData.title );
        this.mergeString( meta.description, siteData.description );
        this.mergeString( meta.content_summary, siteData.content_summary );
    }

    mergeArray (sourceArray = [], targetObject ) {
        sourceArray.forEach(item => this.mergeString( item, targetObject ));
    }

    mergeCollection (sourceCollection = [], key,targetObject ) {
        sourceCollection.forEach(object => this.mergeString( object[key], targetObject ));
    }

    mergeString ( sourceString = '', targetObject ) {
        if ( !!sourceString ) {
            if ( !targetObject[sourceString] ) {
                targetObject[sourceString] = 0
            }
            targetObject[sourceString]++;
        }
    }

    rankSiteData ( siteData ) {
        const rankedSiteData = {};

        // gets the top 100 used value
        each( siteData, (siteValue, siteKey) => {
            if ( siteKey === 'hostname') return; // skip

            let collection = map( siteValue, (rank, value) => ({rank, value}));
            collection = sortBy( collection, [ 'rank', 'string' ], ['desc', 'asc'] );
            collection = slice( collection, 100 );
            rankedSiteData[ siteKey ] = map( collection, 'string' );
        });

        return rankedSiteData;
    }

    async pushElasticSearch ( hostname, body ) {
        const { elasticSearch } = this;
        await elasticSearch.index({
            index: SITE_METADATA,
            _id: hostname,
            body
        });
    }

}

(new ElasticSearchProcessor()).start();