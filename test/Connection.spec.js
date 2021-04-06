
// 패키지 Import
const {
    GanglionClient
} = require('../')

// 인스턴스 생성(싱글톤)
const client = GanglionClient.instance

// 메세지 리스너 등록 (소켓 서버 상태 확인용. 꼭 필요하지는 않음)
const messageListenerId = client.setOnMessageListener(data => {
    console.log(data)
    /** ↑ e.g. Scanning Completed. */
})

// 밴드 데이터 수신 리스너 등록
const bandDataListenerId = client.setOnBandDataListener(data => {
    console.log(data)
    /** ↑ e.g.
     * { delta: 5307.467704082231,
        theta: 1443.5217161444612,
        alpha: 802.5580397016054,
        lowBeta: 593.4192601501279,
        midrangeBeta: 434.6355257503891,
        highBeta: 361.3455091407635,
        gamma: 152.52111534458223 }
     */
})

// Raw 데이터 수신 리스너 등록
const rawDataListenerId =  client.setOnRawDataListener(data => {
    console.log(data)
    /** ↑ e.g.
     *  [ 6687.154103248398,
        2359.8876166944106,
        2665.8675526565967,
        1614.8722496767778,
        1620.5210466578828,
        666.2582139307181,
                ⋮
     */
})

// 60초 후 데이터 수신 정지
setTimeout(() => {
    client.clearOnMessageListener(messageListenerId)
    client.clearOnBandDataListener(bandDataListenerId)
    client.clearOnRawDataListener(rawDataListenerId)
}, 60*1000)