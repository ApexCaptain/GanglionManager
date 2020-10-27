import {
    Ganglion, eegPipes
} from "./OpenbciObservable"
import {
    KoconutSet
} from "koconut"


export class GanglionManager {
    
    private static instance : GanglionManager
    private static GANGLION_FOUND_EVENT = "ganglionFound"

    private ganglion : any
    private isScanning = false
    private foundDevices = new Set<any>()

    private constructor() {
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
            if(this.isScanning) {
                reject(new Error("Ganglion Manager is alreadt in scanning processes"))
                return
            }
            this.isScanning = true
            const onGanglionFoundListener = (peripheral : any) => {
                this.foundDevices.add(peripheral)
            }
            this.ganglion.on(GanglionManager.GANGLION_FOUND_EVENT, onGanglionFoundListener)
            setTimeout(async () => {
                this.ganglion.removeListener(GanglionManager.GANGLION_FOUND_EVENT, onGanglionFoundListener)
                this.foundDevices = await KoconutSet.from(this.foundDevices)
            }, timeoutMills)
            /*
            const addresses = new Set<String>()
            const onGanglionFoundListener
            */
        })
        /*
        const addresses = new Set<String>()
        const onGanglionFoundListener = (peripheral : any) => {
            addresses.add(peripheral.address)
        }
        this.ganglion.searchStart()
        */
        /*
        await this.ganglion.connect()
        await this.ganglion.start()

        this.ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256})
        ).subscribe((data : any) => {
            console.log(data)
        })
        */

    }




}