
const {
    GanglionClient
} = require('../')

const main = async () => {
    const client = GanglionClient.instance

    client.setOnBandDataListener(data => {
        console.log(data)
    })
    
}
main()
