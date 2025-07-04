const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");


async function pullRepo() {
  
}

module.exports = { pullRepo };