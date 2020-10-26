`use strict`

const versionStringReg = /\d+.\d+.\d+/
const fs = require('fs')
const commandExecutor = require('./CommandExecutor.js')
const gitPushingTask = require('./GitPushingTask.js')
const path = require('path')
const rootPath = path.normalize(`${__dirname}/../`)
const packageJsonPath = path.join(rootPath, 'package.json')



const getVersion = () => {
    return require('../package.json').version
}

const generateDefaultNextVersion = () => {
    let defaultNextVersion = getVersion()
        .split('.')
        .map(eachStringNum => parseInt(eachStringNum))
    defaultNextVersion[defaultNextVersion.length - 1]++
    for(let reversedIndex = defaultNextVersion.length - 1 ; reversedIndex >= 1 ; reversedIndex--) {
        if(defaultNextVersion[reversedIndex] == 100) {
            defaultNextVersion[reversedIndex] = 0
            defaultNextVersion[reversedIndex - 1]++
        }
    }
    return defaultNextVersion
                    .map(eachNumber => eachNumber.toString())
                    .join('.')
}

const checkIsNewVersionCodeValid = (newVersionCode) => {
    if(versionStringReg.test(newVersionCode)) {
        const prevVersionIntArray = getVersion().split('.').map(eachCharacter => parseInt(eachCharacter))
        const newVersionIntArray = newVersionCode.split('.').map(eachCharacter => parseInt(eachCharacter))
        for(let index in prevVersionIntArray) {
            if(prevVersionIntArray[index] > newVersionIntArray[index]) break
            if(prevVersionIntArray[index] == newVersionIntArray[index]) continue
            else return true 
        } 
        console.warn(`It should be higher than current version; ${getVersion()}`)
    } else console.warn(`Invalid version code. It should be matched with regular expression : ${versionStringReg}`)
    return false;
}

const distribute = async () => {
    try {
        let newVersionCode
        while(true) {
            newVersionCode = await commandExecutor.readPromisifiedText(`\nCurrent Version : ${getVersion()}\nPlease, type the version string of new package (Default : ${generateDefaultNextVersion()}) : `)
            if(newVersionCode === "") newVersionCode = generateDefaultNextVersion()
            if(checkIsNewVersionCodeValid(newVersionCode)) break
        } 

        const packageToBeChanged = require('../package.json')
        packageToBeChanged.version = newVersionCode
        console.log(`\n-- Check your new package info --\n`)
        console.log(packageToBeChanged)
        while(true) {
            const answer = (await commandExecutor.readPromisifiedText(`\nWould you like to proceed version for ${newVersionCode}? (Y/N) : `)).toUpperCase()
            if(answer == 'Y' || answer == 'YES') break
            else if(answer == 'N' || answer == 'NO') process.exit()
        }

        console.log(`\nUpdating version...`)
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageToBeChanged, null, 2))
        console.log("Package version overriden")

        await gitPushingTask.gitPush(`New version released : ${newVersionCode}`, newVersionCode)
        

        process.exit(0)
    } catch(error) {
        console.error(error)
        process.exit(1)
    }
}
distribute()