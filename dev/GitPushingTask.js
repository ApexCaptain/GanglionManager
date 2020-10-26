`use strict`

const commandExecutor = require('./CommandExecutor.js')

module.exports.gitPush = async (defaultMessage = "No Commit Message", newVersionTag) => {
    let commitMessage
    commitMessage = await commandExecutor.readPromisifiedText(`\nGit Commit Message (Default : ${defaultMessage}) : `)
    if(!commitMessage) commitMessage = defaultMessage
    await commandExecutor.runPromisifiedCommand(`git add -A`, false)
    await commandExecutor.runPromisifiedCommand(`git commit =m "${commitMessage}"`)
    if(newVersionTag) await commandExecutor.runPromisifiedCommand(`git tag "${newVersionTag}"`)
    await commandExecutor.runPromisifiedCommand(`git push origin master --tags`)
    
}
if(process.argv[2] == '-m') module.exports.gitPush()