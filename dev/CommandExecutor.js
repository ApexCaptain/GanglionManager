`use strict`

const exec = require('child_process').exec
const readLine = require('readline').createInterface({
    input : process.stdin,
    output : process.stdout
})

module.exports = {
    runPromisifiedCommand : async (cmd, showLog = true) => {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if(err) reject(err)
                else {
                    const rst = stdout ? stdout : stderr
                    if(showLog) console.log(rst)
                    resolve(rst)
                }
            })
        })
    },
    
    readPromisifiedText : async (text) => {
        return new Promise((resolve) => {
            readLine.question(text, input => resolve(input))
        })
    }
}

