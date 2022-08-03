const EventEmitter = require('events');
const redis = require('redis');

/**
 * @typedef { Object } PubSubResponse
 * @template { Object } T
 * @property { String } Type
 * @property { T } Data
 */

module.exports = class RedisSingleton extends EventEmitter {
    /** @type { redis.RedisClientType } */
    #client;
    /** @type { redis.RedisClientType } */
    #pubsub;
    #prefix = 'Botbear:';
    #active = false;
    
    /**
     * @returns { RedisSingleton }
     */
    static Get() {
        if (!RedisSingleton.module) {
            RedisSingleton.module = new RedisSingleton();
        }

        return RedisSingleton.module;
    }

    constructor() {
        super();

        const opts = {
            url: process.env.REDIS_ADDRESS
        };
        
        this.#client = redis.createClient(opts);
    }

    async #onSubMessage ({ Message, Channel }) {
        try {
            const response = JSON.parse(Message);
            this.emit(Channel, response);
        } catch (error) {
            console.error(`Error parsing Pub/Sub message: ${error}`);
        }
    }
    
    async Connect() {
        if (this.#active) {
            throw new Error('Redis already connected');
        }
        
        await this.#client.connect();
        
        this.#pubsub = this.#client.duplicate();
        await this.#pubsub.connect();
        
        this.#active = true;
    }

	async Subscribe(channel) {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
        return await this.#pubsub
            .PSUBSCRIBE(
                `${this.#prefix}${channel}`,
                (Message, Channel) => 
                    this.#onSubMessage({ Message, Channel }),
            )
            .then(() => `${this.#prefix}${channel}`)
            .catch(() => undefined);
	}

    async Publish(channel, message) {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        return await this.#pubsub.publish(`${this.#prefix}${channel}`, message);
    }

	async Exist(key) {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
		return await this.#client
			.EXISTS(`${this.#prefix}${key}`)
			.then((is) => Boolean(is))
			.catch(() => false);
	}

	async Get(key) {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
		return await this.#client.GET(`${this.#prefix}${key}`);
	}

	async Set(key, value) {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
		return await this.#client.SET(`${this.#prefix}${key}`, value);
	}

	async PING() {
        if (!this.#active) {
            throw new Error('Redis not connected');
        }
        
		return await this.#client.PING();
	}
};
