/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const levelDB = require('./levelSandbox.js');
const chaindb = levelDB.getDbReference();



/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {

    let genesisBlock = new Block("First block in the chain - Genesis block");
    genesisBlock.time = new Date().getTime().toString().slice(0, -3);
    genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
    this.getBlockHeight().then(function (height) {
      if (height === 0) {
        levelDB.addLevelDBData(height, genesisBlock);
      }
    });
  }

  /* ===== Blockchain Class ==========================
  |  Class with a addBlock for new blockchain 		|
  |  ================================================*/

  addBlock(newBlock) {
    // Block height
    return new Promise((resolve, reject) => {
      let ref = this;
      this.getBlockHeight().then(function (height) {
        newBlock.height = height;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        if (newBlock.height > 0) {
          ref.getBlock(height - 1).then(function (response) {
            newBlock.previousBlockHash = JSON.parse(response).hash;
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // Adding block object to chain
            levelDB.addLevelDBData(height, newBlock);
            resolve(JSON.stringify(newBlock));
          });
        }
      });
    });
  }

  /* ===== Blockchain Class ==========================
|  Class with a getBlockHeight for new blockchain 		|
|  ================================================*/

  getBlockHeight() {
    return new Promise((resolve, reject) => {
      let x = 0;
      chaindb.createReadStream().on('data', function (data) {
        x++;
      }).on('error', function (error) {
        return console.log('something not correct in height', err0r)
      }).on('close', function () {
        console.log('Height # ' + x);
        resolve(x)
      });
    })
  }

  /* ===== Blockchain Class ==========================
|  Class with a getBlock for new blockchain 		|
|  ================================================*/

  getBlock(blockHeight) {
    return levelDB.getLevelDBData(blockHeight);
  }

  /* ===== Blockchain Class ==========================
|  Class with a validateBlock for new blockchain 		|
|  ================================================*/

  validateBlock(blockHeight) {
    // get block object
    this.getBlock(blockHeight).then(function (response) {
      let block = JSON.parse(response);
      // get block hash
      let blockHash = JSON.stringify(block.hash).toString();
      block.hash = '';
      let validBlockHash = SHA256(JSON.stringify(block)).toString();

      // Compare
      if (blockHash === validBlockHash) {
        console.log('Block #' + blockHeight + ' validated');
        return true;
      } else {
        console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
        return false;
      }
    });
  }

  /* ===== Blockchain Class ==========================
 |  Class with a validateChain for new blockchain 		|
 |  ================================================*/

  validateChain() {
    let ref = this;
    this.getBlockHeight().then(function (h) {
      let errorLog = [];
      for (var i = 0; i < h - 2; i++) {
        // validate block
        if (!ref.validateBlock(i)) errorLog.push(i);
        // compare blocks hash link
        ref.getBlock(i).then(function (data) {
          let blockHash = JSON.parse(data).hash;
          ref.getBlock(i + 1).then(function (data) {
            let previousHash = JSON.parse(data).previousBlockHash;
            if (blockHash !== previousHash) {
              errorLog.push(i);
            }
            // check
            if (errorLog.length > 0) {
              console.log('Block errors = ' + errorLog.length);
              console.log('Blocks: ' + errorLog);
            } else {
              console.log('No errors detected');
            }
          });
        });

      }

    });
  }
}

let blockchain = new Blockchain();
function addBlockForAPI(body) {
  return blockchain.addBlock(new Block(body.toString()));
}

module.exports = { addBlockForAPI};