import WebSocket, {
    Server
} from 'ws'
import {
    GanglionManager
} from "../module.internal"
import {
    KoconutArray
} from 'koconut'

export class GanglionSocketServer {

    private static sInstance : GanglionSocketServer
    static get instance() : GanglionSocketServer {
        if(!this.sInstance) this.sInstance = new GanglionSocketServer
        return this.sInstance
    }

    private socketServer : Server
    private ganglionManager : GanglionManager
    private sockets : Array<WebSocket>

    private constructor() {
        
        this.socketServer = new Server({
            port : 3030
        })

        this.ganglionManager = GanglionManager.getInstance()
        this.sockets = new Array()

        this.socketServer.on('connection', socket => {
            this.sockets.push(socket)
            socket.on('close', async () => {
                this.sockets = await KoconutArray
                                        .from(this.sockets)
                                        .minusElement(socket)
                                        .yield()
            })
            this.ganglionManager.on(GanglionManager.ON_RAW_DATA_EVENT, data => {
                socket.send(JSON.stringify({
                    type : "RAW",
                    data : data
                }))
            })
            this.ganglionManager.on(GanglionManager.ON_BAND_DATA_EVENT, data => {
                socket.send(JSON.stringify({
                    type : "BAND",
                    data : data
                }))
            })

        })
        let isFinishing = false;
        ['exit', 'SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(eachSignal => {
            process.on(eachSignal, async () => {
                if(isFinishing) return
                isFinishing = true
                console.log("Finishing Server...")
                await this.ganglionManager.disconnect()
                console.log("Done")
            })
        })
        this.setUp()
    }

    private sendLogMessage(message : any) {
        console.log(message)
        this.sockets.forEach(eachSocket =>{
            try {
                eachSocket.send(JSON.stringify({
                    type : "MESSAGE",
                    data : message
                }))
            } catch(error) {}
        })
    }

    private async setUp() {
        let devices = new Array()
        let retryCount = 0
        while(devices.length == 0 && retryCount < 5) {
            this.sendLogMessage("Scanning...")
            devices = Array.from(await this.ganglionManager.scan())
            retryCount++
        }
        if(retryCount >= 5) {
            this.sendLogMessage("Scanning Failed... No device found")
            process.exit(1)
        }
        this.sendLogMessage("Scanning Completed.")
        try {
            await this.ganglionManager.connect(devices[0])
            this.sendLogMessage(`Successfully Connected to ${devices[0]}`)
        } catch(error) {
            this.sendLogMessage(`Unable to connect to device ${devices[0]}`)
            process.exit(1)
        }
        await this.ganglionManager.startStream()

    }

}