const {
    GanglionManager
} = require("../")

const main = async () => {
    const gm = GanglionManager.getInstance()

    gm.on(GanglionManager.ON_BAND_DATA_EVENT, data => {
        console.log(data)
    })
    await gm.connect(
        "Ganglion-2bfb"
    )

    await gm.startStream()
    setTimeout(async () => {
        console.log("Stop!")
        await gm.disconnect()
        console.log(
            gm.isScanning,
            gm.isStreaming,
            gm.isConnected
        )
    }, 10000)
}
main()