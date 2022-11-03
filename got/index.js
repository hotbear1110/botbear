module.exports = (() => {
    return new class {
        /** @type { import('got').Got } */
        #got = null;
        
        async Setup() {
            this.#got = (await import('got'))
                .default
                .extend({
                    headers: {
                        'User-Agent': 'Botbear'
                    },
                    timeout: {
                        request: 3500
                    }
                });
        }

        /**
         * @returns { import('got').Got }
         */
        get got() {
            return this.#got;
        }
    };
})();
