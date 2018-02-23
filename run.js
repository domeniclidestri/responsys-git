const fs = require('fs')
const execSync = require('child_process').execSync;
const chalk = require('chalk')
const log = console.log
const ResponsysContentLibrary = require('responsys-rest-api/lib/ResponsysContentLibrary')

const REPO_DIR = process.env.RESPONSYS_API_CONTENT_LIBRARY_FILE_DIR
const GIT_USER_NAME = process.env.GIT_USER_NAME
const GIT_USER_EMAIL = process.env.GIT_USER_EMAIL
const GIT_REPO = `${process.env.GIT_PROTOCOL}://${GIT_USER_NAME}:${process.env.GIT_PASSWORD}@${process.env.GIT_REPO}`

if (fs.existsSync(REPO_DIR)) {

    // Directory exists, git pull to update local repo
    log(execSync(`
        cd ${REPO_DIR} &&
        git pull ${GIT_REPO}
    `).toString())

}
else {

    // No repo, first time running, git clone remote and set defaults
    log(execSync(`
        git clone ${GIT_REPO} ${REPO_DIR} &&
        cd ${REPO_DIR} &&
        git config core.longpaths true &&
        git config user.name "${GIT_USER_NAME}" &&
        git config user.email "${GIT_USER_EMAIL}"
    `).toString())

}

// We have a repo, start downloading content
new Promise((resolve, reject) => {

    (new ResponsysContentLibrary).fetchAll(resolve)

}).then((result) => {

    // Switch to repo dir
    process.chdir(REPO_DIR)

    // Get number of files that have been modified
    let numFilesChanged = parseInt(execSync(`git diff --numstat | wc -l`).toString(), 10)

    // Get number of new files added
    let numFilesAdded = parseInt(execSync(`git ls-files --others --exclude-standard | wc -l`).toString(), 10)

    // Add files, commit and push to remote if there are changes
    if (numFilesChanged > 0 && numFilesAdded > 0) {
        log(execSync(`
            git add . &&
            git commit -m 'Automated: ${numFilesChanged} files changed, ${numFilesAdded} files added' &&
            git push ${GIT_REPO}
        `).toString())
    }
    else {
        log('Nothing to do, already up to date')
    }

})




