import {
    GanglionManager
} from "../index"

const test = async () => {
    console.log("Start")
    await GanglionManager.getInstance().scan()
    console.log("Finished")
}
test()