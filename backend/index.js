const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const mainRouter = require('./routes/main.router.js');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { commitRepo } = require('./controllers/commit.js');
const { pushRepo } = require('./controllers/push.js');
const { pullRepo } = require('./controllers/pull.js');
const { revertRepo } = require('./controllers/revert.js');

dotenv.config();

yargs(hideBin(process.argv))
  .command(
    'start',
    'starts a new server',
    {},
    startServer
  )
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
    (argv) => {
      addRepo(argv.file);
    }
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
    (argv) => {
      commitRepo(argv.message);
    }
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
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, 'You need atleast one command')
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => {console.log('MongoDB connected!')})
    .catch((err) => {console.error(console.error('Unable to connect!', err))});

  app.use(cors({origin:"*"}));

  app.use('/', mainRouter);

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (userID) => {
      user = userID;
      console.log('=====');
      console.log(user);
      console.log('=====');
      socket.join(userID);

    });
  });

  const db = mongoose.connection;

  db.once('open', async () => {
    console.log('CRUD operations called');
    //TODO: crud operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
}