const { 
    GanglionManager
} = require('../dist/index')
const myGanglionManager = GanglionManager.getInstance()

const main = async () => {

    console.log(
        await myGanglionManager.scan()
    ) // i.e, Set { 'Ganglion-2bfb' } <- 로컬 BT 장비 명

    await myGanglionManager.connect('Ganglion-2bfb') // <- 연결할 보드의 Local Name

    myGanglionManager.on(
        GanglionManager.ON_RAW_DATA_EVENT,
        (channel1, channel2) => {
            console.log(
                channel1,
                channel2
            )
        }
    )

    /*
    myGanglionManager.on(
        GanglionManager.ON_BAND_DATA_EVENT,
        bandData => {
            console.log(
                bandData // 알파파, 베타파 등등
            )
        }
    )
    */

    await myGanglionManager.startStream()

    setTimeout(async () => {
        await myGanglionManager.disconnect()
    }, 10000)

}
main()