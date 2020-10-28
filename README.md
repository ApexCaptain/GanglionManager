# GanglionManager

[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Node.js Version][node-version-image]][node-version-url]

# Raspbian Prerequisites
```sh
$ sudo apt-get install -y libbluetooth-dev libudev-dev
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
- 패키지 Import
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
    ```

- Instance 생성
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')

    const myGanglionManager = GanglionManager.getInstance()
    ```

- 주변 Ganglion Board 정보 검색
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
    const myGanglionManager = GanglionManager.getInstance()

    const main = async () => {

        console.log(
            await myGanglionManager.scan()
        ) // i.e, Set { 'Ganglion-2bfb' } <- 로컬 BT 장비 명

    }
    main()
    ```

- 보드 연결
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
    const myGanglionManager = GanglionManager.getInstance()

    const main = async () => {

        console.log(
            await myGanglionManager.scan()
        ) // i.e, Set { 'Ganglion-2bfb' } <- 로컬 BT 장비 명

        await myGanglionManager.connect('Ganglion-2bfb') // <- 연결할 보드의 Local Name

    }
    main()
    ```

- 데이터 이벤트 리스너 등록
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
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
                    channel1, // 1번 채널 eeg 데이터
                    channel2  // 2번 채널 eeg 데이터
                )
            }
        )

        myGanglionManager.on(
            GanglionManager.ON_BAND_DATA_EVENT,
            bandData => {
                console.log(
                    bandData // 알파파, 베타파 등등
                )
            }
        )

    }
    main()
    ```
    [node.js EventEmitter](https://www.npmjs.com/package/events) 사용법 참조

- 데이터 스트림 시작
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
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
                    channel1, // 1번 채널 eeg 데이터
                    channel2  // 2번 채널 eeg 데이터
                )
            }
        )

        myGanglionManager.on(
            GanglionManager.ON_BAND_DATA_EVENT,
            bandData => {
                console.log(
                    bandData // 알파파, 베타파 등등
                )
            }
        )

        await myGanglionManager.startStream()

    }
    main()
    ```

- 데이터 스트림 종료 (예시, 10초 후 종료)
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
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
                    channel1, // 1번 채널 eeg 데이터
                    channel2  // 2번 채널 eeg 데이터
                )
            }
        )

        myGanglionManager.on(
            GanglionManager.ON_BAND_DATA_EVENT,
            bandData => {
                console.log(
                    bandData // 알파파, 베타파 등등
                )
            }
        )

        await myGanglionManager.startStream()

        setTimeout(async () => {
            await myGanglionManager.stopStream()
        }, 10000)

    }
    main()
    ```

- 연결 해제 (예시, 10초 후 해제)
    ```javascript
    const { 
        GanglionManager
    } = require('ganglion-manager')
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
                    channel1, // 1번 채널 eeg 데이터
                    channel2  // 2번 채널 eeg 데이터
                )
            }
        )

        myGanglionManager.on(
            GanglionManager.ON_BAND_DATA_EVENT,
            bandData => {
                console.log(
                    bandData // 알파파, 베타파 등등
                )
            }
        )

        await myGanglionManager.startStream()

        setTimeout(async () => {
            await myGanglionManager.disconnect()
        }, 10000)

    }
    main()
    ```

# etc
## 다음의 속성 Getter 제공
- 
    ```javascript
        get isScanning() : boolean { 
            return this.mIsScanning
        }
        // myGanglionManager.isScanning

        get isStreaming() : boolean {
            return this.mIsStreaming
        }
        // myGanglionManager.isStreaming

        get isConnected() : boolean {
            return this.mIsConnected
        }
        // myGanglionManager.isConnected
    ```
[npm-image]: https://img.shields.io/npm/v/koconut.svg?color=CB0000&label=npm&style=plastic&logo=npm
[npm-url]: https://www.npmjs.com/package/ganglion-manager


[license-image]: https://img.shields.io/github/license/ApexCaptain/GanglionManager.svg?color=E2AC00&label=License&style=plastic&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHSSURBVDiNpZLLa1NREMa%2FmXvzaG2lKDW2EdNqi6Ckxq5Kdy0UsnQTs1CrWxcidFPEnYumG%2FFfUHRloC5cBTU%2Bdi6Cr1QUYh9wqS3RWmqoNzf3zrgIN2DahkK%2B1Zw5v%2Flm5nCANkV%2BoC%2BiR6uQayHXeEBJa9N%2BdWKIHO85AGjQmApPWKVm5j%2BDWr5vxv1m3OOIQioE7hZImQEA3CuQP1zPrTOMM95McPLHfQBg32BuYXQxtxMtzOcTyY5pi7SHh7nfs7nfs%2FWwO9QxbdH8ywvJ3E60kFkY%2FeLXmX6wuNYzVdzoHFcJ3QWQC09YpUom9g4Aum6vft%2BLaUyQSl0dhKKUzWYdgqymL6ZPA0DgXC3uN9iPqa%2FgynU1nccAYDtdDz02rtSfmBor7sdQ9U0k%2Fmkpcicx8PO9z35YOZIYOVWew7b5tlY0PwbG7ZvF5d7Zkdjm52bGJJfHzsfKaVWkZYPhrRg4i22IBB0%2BJvVBXB6Ln%2Fx1WRXYxQQ49IgITwGq6V8CSEHdshZm45bf7SDMnqo%2Bi%2F6uZGKvWzHc6vIgatuAmhPV%2FPFLTDwIALKFlG7RkjGgBQAQleXQ5PqTlgZOvq8C4JB%2F9r42PiuU1Ou8YZnNNW3pH9Tv3ULkpzpnAAAAAElFTkSuQmCC
[license-url]: https://github.com/ApexCaptain/GanglionManager/blob/master/LICENSE


[node-version-image]: http://img.shields.io/node/v/ganglion-manager.svg?style=plastic&color=378C37&label=Node.js&logo=node.js
[node-version-url]: https://nodejs.org/download/