import {
    Ganglion, eegPipes
} from "./OpenbciObservable"



export class GanglionManager {
    private static instance : GanglionManager
    private ganglion : any
    private constructor() {
        this.ganglion = new Ganglion()
    }
    static getInstance() : GanglionManager {
        if(!GanglionManager.instance) {
            GanglionManager.instance = new GanglionManager()
        }
        return GanglionManager.instance
    }

    async scan() {

        await this.ganglion.connect()
        await this.ganglion.start()

        this.ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256})
        ).subscribe((data : any) => {
            console.log(data)
        })

    }




}