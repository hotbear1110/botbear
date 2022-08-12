const EventEmitter = require('events');
const redis = require('redis');

/**
 * @typedef {Object} EventSubChatUpdate
 * @property { string } Channel - THe channel to send the message to.
 * @property { string[] } Message - The message to send. Split into an array of strings.
 */

/**
 * @typedef { Object } PubSubResponse
 * @template { Object } T
 * @property { String } Type - The type of response.
 * @property { T } Data - Data specific to the Type
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

        if (!process.env.REDIS_ADDRESS) {
            console.log("Redis not connected")
        }
        else {
            this.#client = redis.createClient(opts);
        }
    }

    async #onSubMessage (Message) {
        try {
            /** @type { PubSubResponse } */
            const response = JSON.parse(Message);
            this.emit(response.Type, response.Data);
        } catch (error) {
            console.error(`Error parsing Pub/Sub message: ${error}`);
        }
    }
    
    async Connect() {
        if (this.#active) {
            console.log('Redis already connected');
            return;
        }

        if (process.env.REDIS_ADDRESS) {
            await this.#client.connect();
        
            this.#pubsub = this.#client.duplicate();
            await this.#pubsub.connect();
            
            this.#active = true;
        }
    }

	async Subscribe(channel) {
        if (!this.#active) {
            console.log('Redis not connected');
            return;
        }
        
        return await this.#pubsub
            .PSUBSCRIBE(
                `${this.#prefix}${channel}`,
                (Message) => 
                    this.#onSubMessage(Message),
            )
            .then(() => `${this.#prefix}${channel}`)
            .catch(() => undefined);
	}

    async Publish(channel, message) {
        if (!this.#active) {
            console.log('Redis not connected');
            return;
        }
        
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        return await this.#pubsub.publish(`${this.#prefix}${channel}`, message);
    }

	async Exist(key) {
        if (!this.#active) {
            console.log('Redis not connected');
            return;
        }
        
		return await this.#client
			.EXISTS(`${this.#prefix}${key}`)
			.then((is) => Boolean(is))
			.catch(() => false);
	}

	async Get(key) {
        if (!this.#active) {
            console.log('Redis not connected');
            return;
        }
        
		return await this.#client.GET(`${this.#prefix}${key}`);
	}

	async Set(key, value) {
        if (!this.#active) {
            console.log('Redis not connected');
            return;
        }
        
		return await this.#client.SET(`${this.#prefix}${key}`, value);
	}

	async PING() {
        if (!this.#active) {
            console.log('Redis not connected');
            return
        }
        
		return await this.#client.PING();
	}
};
