# GanglionManager

[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Node.js Version][node-version-image]][node-version-url]

# 사전 설치 및 런타임(미들웨어) 요구사항
```sh
$ sudo apt-get install -y build-essential libbluetooth-dev libudev-dev
```
- node.js v8.0
- Python v2.7

# Installation
```sh
$ npm install ganglion-manager --save

or

$ yarn add ganglion-manager
```

# Example
```javascript

// 패키지 Import
const {
    GanglionClient
} = require('ganglion-manager')

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
```

[npm-image]: https://img.shields.io/npm/v/koconut.svg?color=CB0000&label=npm&style=plastic&logo=npm
[npm-url]: https://www.npmjs.com/package/ganglion-manager


[license-image]: https://img.shields.io/github/license/ApexCaptain/GanglionManager.svg?color=E2AC00&label=License&style=plastic&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHSSURBVDiNpZLLa1NREMa%2FmXvzaG2lKDW2EdNqi6Ckxq5Kdy0UsnQTs1CrWxcidFPEnYumG%2FFfUHRloC5cBTU%2Bdi6Cr1QUYh9wqS3RWmqoNzf3zrgIN2DahkK%2B1Zw5v%2Flm5nCANkV%2BoC%2BiR6uQayHXeEBJa9N%2BdWKIHO85AGjQmApPWKVm5j%2BDWr5vxv1m3OOIQioE7hZImQEA3CuQP1zPrTOMM95McPLHfQBg32BuYXQxtxMtzOcTyY5pi7SHh7nfs7nfs%2FWwO9QxbdH8ywvJ3E60kFkY%2FeLXmX6wuNYzVdzoHFcJ3QWQC09YpUom9g4Aum6vft%2BLaUyQSl0dhKKUzWYdgqymL6ZPA0DgXC3uN9iPqa%2FgynU1nccAYDtdDz02rtSfmBor7sdQ9U0k%2Fmkpcicx8PO9z35YOZIYOVWew7b5tlY0PwbG7ZvF5d7Zkdjm52bGJJfHzsfKaVWkZYPhrRg4i22IBB0%2BJvVBXB6Ln%2Fx1WRXYxQQ49IgITwGq6V8CSEHdshZm45bf7SDMnqo%2Bi%2F6uZGKvWzHc6vIgatuAmhPV%2FPFLTDwIALKFlG7RkjGgBQAQleXQ5PqTlgZOvq8C4JB%2F9r42PiuU1Ou8YZnNNW3pH9Tv3ULkpzpnAAAAAElFTkSuQmCC
[license-url]: https://github.com/ApexCaptain/GanglionManager/blob/master/LICENSE


[node-version-image]: http://img.shields.io/node/v/ganglion-manager.svg?style=plastic&color=378C37&label=Node.js&logo=node.js
[node-version-url]: https://nodejs.org/download/