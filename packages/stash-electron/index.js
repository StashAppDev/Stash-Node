const { app } = require('electron')
const { Stash } = require('./dist-server/stash/stash')
const { run } = require('./dist-server/server')

async function start () {
  await Stash.initialize();
  run({ port: 7000 })
}

app.on('ready', start)