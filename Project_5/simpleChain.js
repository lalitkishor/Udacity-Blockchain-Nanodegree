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
      this.timeStamp =  new Date().getTime(),
      this.address = "",
      this.signature = "",
      this.star = {},
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

  // add method to address and signature
 addBlockWithTimeStempMain(newBlock,address,signature,star){
    let ref = this;
    this.getBlockHeight().then(function (height) {
      newBlock.height = height;
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0, -3);
      newBlock.timeStamp = new Date().getTime();
      newBlock.address = address;
      newBlock.signature = signature;
      newBlock.star = star;
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
}

let blockchain = new Blockchain();

function addBlockWithTimeStemp(body,address,signature,star){
  blockchain.addBlockWithTimeStempMain(new Block(body.toString()),address,signature,star)
}

module.exports = {addBlockWithTimeStemp};