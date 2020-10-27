import {
    Ganglion, eegPipes
} from "./OpenbciObservable"
import {
    EventEmitter
} from "events"
export class GanglionManager extends EventEmitter {
    
    public static ON_RAW_DATA_EVENT = "onRawData"
    public static ON_BAND_DATA_EVENT = "onBandData"

    private static instance : GanglionManager
    private static GANGLION_FOUND_EVENT = "ganglionFound"

    private ganglion : any
    private mIsScanning = false
    private mIsStreaming = false
    private mIsConnected = false

    get isScanning() : boolean { 
        return this.mIsScanning
    }

    get isStreaming() : boolean {
        return this.mIsStreaming
    }

    get isConnected() : boolean {
        return this.mIsConnected
    }

    private constructor() {
        super()
        this.ganglion = new Ganglion()
    }
    static getInstance() : GanglionManager {
        if(!GanglionManager.instance) {
            GanglionManager.instance = new GanglionManager()
        }
        return GanglionManager.instance
    }

    
    async scan(timeoutMills : number = 5000) : Promise<Set<String>> {
        return new Promise(async (resolve, reject) => {
            if(this.mIsScanning) {
                reject(new Error(`${this.constructor.name} is already on scanning`))
                return
            }
            this.mIsScanning = true
            const localNames = new Set<String>()
            const onGanglionFoundListener = (peripheral : any) => {
                localNames.add(peripheral.advertisement.localName)
            }
            this.ganglion.on(GanglionManager.GANGLION_FOUND_EVENT, onGanglionFoundListener)
            this.ganglion.searchStart()
            setTimeout(async () => {
                this.ganglion.removeListener(GanglionManager.GANGLION_FOUND_EVENT, onGanglionFoundListener)
                this.ganglion.searchStop()
                this.mIsScanning = false
                resolve(localNames)
            }, timeoutMills)
        })
    }


    async connect(localName : String | undefined = undefined) : Promise<void> {
        if(this.mIsConnected) await this.disconnect()
        await this.ganglion.connect(localName)
        this.mIsConnected = true
    }


    async startStream() {
        if(this.mIsStreaming) throw new Error(`${this.constructor.name} is already on streaming`)
        this.mIsStreaming = true
        await this.ganglion.start()
        this.ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256})
        ).subscribe((data : any) => {
            const channel1Data : Array<number> = data[0]
            const cahnnel2Data : Array<number> = data[1]
            this.emit(GanglionManager.ON_RAW_DATA_EVENT, channel1Data, cahnnel2Data)
        })
        this.ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256}),
            eegPipes.powerByBand({
                delta : [0.1, 3],        // 0.1 ~ 3 Hz
                theta : [4, 7],          // 4 ~ 7 Hz
                alpha : [8, 12],         // 8 ~ 12 Hz
                lowBeta : [12, 15],      // 12 ~ 15 Hz
                midrangeBeta : [16, 20], // 16 ~ 20 Hz
                highBeta : [21, 30],     // 21 ~ 30 Hz
                gamma : [30, 100]        // 30 Hz and more...
            })
        )
        .subscribe((data : {
            delta : Array<number>,
            theta : Array<number>,
            alpha : Array<number>,
            lowBeta : Array<number>,
            midrangeBeta : Array<number>,
            highBeta : Array<number>,
            gamma : Array<number>,
        }) => {
            const result = {
                delta : data.delta.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                theta : data.theta.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                alpha : data.alpha.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                lowBeta : data.lowBeta.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                midrangeBets : data.midrangeBeta.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                highBeta : data.highBeta.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2,
                gamma : data.gamma.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2
            }
            this.emit(GanglionManager.ON_BAND_DATA_EVENT, result)
        })
    }


    async stopStream() {
        await this.ganglion.streamStop()
        this.mIsStreaming = false
    }


    async disconnect() {
        if(this.mIsConnected) {
            await this.stopStream()
            this.ganglion.disconnect()
            this.mIsConnected = false
        }
    }








}