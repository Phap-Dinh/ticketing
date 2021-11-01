import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NASTS client before connecting')
        }

        return this._client
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url })

        // NOT HERE
        // The reason: we have some method inside of NatsWrapper that is buried (duoc dung) inside of some class
        // inside of project that can possibly cause entire process to exit entirely

        // this._client.on('close', () => {
        //     console.log('NATS connection closed!')
        //     process.exit()
        // })

        // process.on('SIGINT', () => this.client.close())
        // process.on('SIGTERM', () => this.client.close())

        // this.client is Getter
        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
              console.log('Connected to NATS')
              resolve()
            })

            this.client.on('error', (err) => {
                reject(err)
            })
        })

        // private _client?: Stan => exist of not

        // return new Promise<void>((resolve, reject) => {
        //     this._client!.on('connect', () => {
        //       console.log('Connected to NATS')
        //       resolve()
        //     })

        //     this._client!.on('error', (err) => {
        //         reject(err)
        //     })
        // })
    }

}

export const nastWrapper = new NatsWrapper()
