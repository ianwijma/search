module.exports = class AbstractSingleton {

    instance = null

    getInstance () {
        if ( !this.instance ) {
            this.instance = this._newInstance()
        }

        return this.instance;
    }

    _newInstance () {
        throw new Error('Extend _newInstance');
    }

}