
module.exports = class Runner {

    async start () {
        await this.setup();
        this.run();
    }

    setup() {}
    run() {}

}