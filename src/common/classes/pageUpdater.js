import Redis from './redis';
const { nanoid } = require('nanoid/async');

const {
    HASH_LIST_PAGE_HASH,
    HASH_LIST_PAGE_UPDATED,
    HASH_LIST_HOSTNAME_PAGE_TOTAL,
    HASH_LIST_HOSTNAME_PAGE_COUNTER
} = require('../constants/redis');

const { HOSTNAME_MAX_TOTAL, UPDATE_DIFFERENCE_MS } = require('../constants/misc');

const urlTools = require('../utilities/urlTools');

module.exports = class PageUpdater {

    constructor() {
        this.redis = new Redis();
        this.pageHashList = this.redis.getHashList( HASH_LIST_PAGE_HASH );
        this.pageUpdatedList = this.redis.getHashList( HASH_LIST_PAGE_UPDATED );
        this.hostnamePageTotalList = this.redis.getHashList( HASH_LIST_HOSTNAME_PAGE_TOTAL );
        this.hostnamePageCounterList = this.redis.getHashList( HASH_LIST_HOSTNAME_PAGE_COUNTER );
    }

    async getPageHash ( hostname, pathname, search ) {
        const url = urlTools.buildPlainUrl( hostname, pathname, search );
        let hash = await this.pageHashList.get( url );
        if ( !hash ) {
            hash = await nanoid();
            await this.pageHashList.set( url, hash );
        }
        return hash;
    }

    async canQueuePage ( hostname, pathname, search ) {
        const [
            hostnameHash, pageHash
        ] = await Promise.all([
            this.getPageHash( hostname ),
            this.getPageHash( hostname, pathname, search ),
        ]);
        const [
            updatedAtString, hostnamePageTotal
        ] = await Promise.all([
            this.pageUpdatedList.get( pageHash ),
            this.hostnamePageTotalList.get( hostnameHash ),
        ]);

        if ( !isNaN( hostnamePageTotal ) && hostnamePageTotal >= HOSTNAME_MAX_TOTAL ) return false;
        if ( isNaN( updatedAtString ) ) return true;

        const updatedAt = new Date( updatedAtString );
        const now = Date.now();
        return ( now - updatedAt.getTime() ) > UPDATE_DIFFERENCE_MS;
    }

    async pageUpdated (hostname, pathname, search ) {
        const [
            hostnameHash, pageHash
        ] = await Promise.all([
            this.getPageHash( hostname ),
            this.getPageHash( hostname, pathname, search ),
        ]);
        await Promise.all([
            this.hostnamePageTotalList.incr( hostnameHash ),
            this.hostnamePageCounterList.incr( hostnameHash ),
            this.pageUpdatedList.set( pageHash, Date.now() ),
        ]);
    }

    async decreaseHostnameCounter ( hostname ) {
        const hostnameHash = await this.getPageHash( hostname );
        return await this.hostnamePageTotalList.decr( hostnameHash );
    }

    async resetHostnameTotal ( hostname ) {
        const hostnameHash = await this.getPageHash( hostname );
        return await this.hostnamePageTotalList.set( hostnameHash, 0 );
    }

}