const fs = require('fs').promises;
const path = require('path');

async function commitRepo() {
  console.log('commit command called');
}

module.exports = { commitRepo };