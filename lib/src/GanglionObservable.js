const Ganglion = require('openbci-ganglion')
const { OBCIEmitterSample } = require('openbci-utilities/dist/constants')
const { fromEvent } = require('rxjs/observable/fromEvent')
const { map } = require('rxjs/operators/map')

const { renameDataProp, onExit } = require('openbci-observable/src/utils')

class GanglionObservable extends Ganglion {

    constructor(...options) {
        super(...options)
        this.stream = fromEvent(this, OBCIEmitterSample)
            .pipe(map(renameDataProp))
        onExit(this)
    }

}

module.exports = GanglionObservable