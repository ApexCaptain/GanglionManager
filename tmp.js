`use strict`

var instance = null
var isSingletonInstantiate = false

const { Ganglion } = require('openbci-observable')
const eegPipes = require('eeg-pipes')

class GanglionManager {
    static getInstance() {
        if(!instance) {
            isSingletonInstantiate = true
            instance = new GanglionManager()
            isSingletonInstantiate = false
        }
        return instance
    }

    constructor() {
        if(!isSingletonInstantiate) throw new Error(`${this.constructor.name} cannot be instanitated directly`)
    }

    async getEegData(rawDataCallback, bandDataCallback) {
        const ganglion = new Ganglion()
        await ganglion.connect()
        await ganglion.start()
        
        ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256})
        ).subscribe(data => {
            rawDataCallback(data[1], data[2])
        })

        ganglion.stream.pipe(
            eegPipes.voltsToMicrovolts(),
            eegPipes.bufferFFT({bins : 256}),
            eegPipes.powerByBand({
                delta : [0.1, 3],        // 0.1 ~ 3 Hz
                theta : [4, 7],          // 4 ~ 7 Hz
                alpha : [8, 12],         // 8 ~ 12 Hz
                lowBeta : [12, 15],      // 12 ~ 15 Hz
                midrangeBets : [16, 20], // 16 ~ 20 Hz
                highBeta : [21, 30],     // 21 ~ 30 Hz
                gamma : [30, 100]        // 30 Hz and more...
            })
        ).subscribe(data => {
            for(let [eachBandName, dataBuffer] of Object.entries(data)) {
                data[eachBandName] = dataBuffer.slice(1,3).reduce((acc, eachValue) => acc + eachValue, 0)/2
            }
            bandDataCallback(data)
        })
        

    }
}

module.exports = GanglionManager