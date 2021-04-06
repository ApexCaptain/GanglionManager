import WebSocket from "ws"
import http from 'http'
import {
    exec
} from 'child_process'
enum EegDataType {
    BAND = "BAND",
    RAW = "RAW",
    MESSAGE = "MESSAGE"
}

type ListenerKey = number

type Message = string
type OnMessageListener = (message : Message) => void

type RawData = Array<number>
type OnRawDataListener = (rawData : RawData) => void

type BandData = {
    delta : number,
    theta : number,
    alpha : number,
    lowBeta : number,
    midrangeBeta : number,
    highBeta : number,
    gamma : number
}
type OnBandDataListener = (bandData : BandData) => void

export class GanglionClient{
    
    private globalListenerKey = 0
    private getNextKey() : ListenerKey {
        return this.globalListenerKey++
    }

    private onMessageListeners = new Map<ListenerKey, OnMessageListener>()
    setOnMessageListener(messageListener : OnMessageListener) : ListenerKey {
        const key = this.getNextKey()
        this.onMessageListeners.set(key, messageListener)
        return key
    }
    clearOnMessageListener(listenerKey : ListenerKey) : boolean {
        if(this.onMessageListeners.has(listenerKey)) {
            this.onMessageListeners.delete(listenerKey)
            return true
        } else return false
    }

    private onRawDataListeners = new Map<ListenerKey, OnRawDataListener>()
    setOnRawDataListener(rawDataListener : OnRawDataListener) : ListenerKey {
        const key = this.getNextKey()
        this.onRawDataListeners.set(key, rawDataListener)
        return key
    }
    clearOnRawDataListener(listenerKey : ListenerKey) : boolean {
        if(this.onRawDataListeners.has(listenerKey)) {
            this.onRawDataListeners.delete(listenerKey)
            return true
        } else return false
    }

    private onBandDataListeners = new Map<ListenerKey, OnBandDataListener>()        
    setOnBandDataListener(bandDataListener : OnBandDataListener) : ListenerKey {
        const key = this.getNextKey()
        this.onBandDataListeners.set(key, bandDataListener)
        return key
    }
    clearOnBandDataListener(listenerKey : ListenerKey) : boolean {
        if(this.onBandDataListeners.has(listenerKey)) {
            this.onBandDataListeners.delete(listenerKey)
            return true
        } else return false
    }
    

    private static sInstance : GanglionClient
    private socket : WebSocket | null = null
    static get instance() : GanglionClient {
        if(!this.sInstance) this.sInstance = new GanglionClient()
        return this.sInstance
    }

    private constructor() { 
        this.setAsyncOptions()
    }

    private async setAsyncOptions() {
        await this.setSocketClient()
        this.setSocketListener()
    }

    private  async  runPromisifiedCommand(cmd : string, showLog : boolean = true) : Promise<string> {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if(err) reject(err)
                else {
                    const rst = stdout ? stdout : stderr
                    if(showLog) console.log(rst)
                    resolve(rst)
                }
            })
        })
    }

    private async setSocketClient() : Promise<void>  {
        return new Promise((resolve) => {
            let isFirstError = true
            const serverCheckingInterval = setInterval(() => {
                const req = http.request({
                    host : 'localhost',
                    port : '3030',
                    path : "/",
                    method : "GET"
                }, () => {
                    clearInterval(serverCheckingInterval)
                    this.socket = new WebSocket("ws://localhost:3030", "echo-protocol")
                    resolve()
                })
                req.once('error', async () => {
                    if(isFirstError) {
                        isFirstError = false
                        await this.runPromisifiedCommand(`sudo node ${__dirname}/../../wss.js`)
                    }
                })
                req.end()
            }, 5000)
        })
    }

    private setSocketListener() {
        this.socket!!.on('message', data => {
            const parsedData = JSON.parse(data.toString())
            switch(parsedData.type) {
                case EegDataType.MESSAGE :
                    this.onMessageListeners.forEach(eachListener => {
                        eachListener(parsedData.data)
                    })
                    break;
                case EegDataType.RAW :
                    this.onRawDataListeners.forEach(eachListener => {
                        eachListener(parsedData.data)
                    })
                    break;
                case EegDataType.BAND :
                    this.onBandDataListeners.forEach(eachListener => {
                        eachListener(parsedData.data)
                    })
                    break;
            }
        })
    }


}