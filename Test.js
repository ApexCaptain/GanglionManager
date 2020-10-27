const ganglionManager = require("./Tmp.js").getInstance()

console.log(ganglionManager)
const main = async () => {
    setInterval(() => {

    }, 1000)
    await ganglionManager.getEegData(
        (data) => {
            console.log(data)
        },
        (data) => {
            console.log(data)
        }
    )
}
main()