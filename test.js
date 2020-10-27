const gm = require("./tmp.js").getInstance()

const main = async () => {
    await gm.getEegData(
        (d1, d2) => {
            console.log(d1, d2)
        },
        (band) => {
            console.log(band)
        }
    )
}
main()