const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { commitRepo } = require('./controllers/commit.js');
const { pushRepo } = require('./controllers/push.js');
const { pullRepo } = require('./controllers/pull.js');
const { revertRepo } = require('./controllers/revert.js');

yargs(hideBin(process.argv))
  .command(
    'init', 
    'Initialize a new repository', 
    {}, 
    initRepo
  )
  .command(
    'add <file>', 
    'Add a file to the repository', 
    (yargs) => {
      yargs.positional('file', {
        describe: 'File to add to the staging area',
        type: 'string'
      })
    }, 
    addRepo
  )
  .command(
    'commit <message>', 
    'Commit the staged files', 
    (yargs) => {
      yargs.positional('message', {
        describe: 'Commit message',
        type: 'string'
      })
    }, 
    commitRepo
  )
  .command(
    'push',
    'push commits to S3', 
    {}, 
    pushRepo
  )
  .command(
    'pull', 
    'pull commits from S3', 
    {}, 
    pullRepo
  )
  .command(
    'revert <commitID>', 
    'Revert to a specific commit', 
    (yargs) => {
      yargs.positional('commitID', {
        describe: 'CommitID to revert to',
        type: 'string'
      })
    }, 
    revertRepo
  )
  .demandCommand(1, 'You need atleast one command')
  .help().argv;