/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, JSON.stringify(value), function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  return new Promise((resolve,reject)=>{
    db.get(key, function(err, value) {
      if (err) {
        reject(err);
      }
      else{
      console.log('Value = ' + JSON.parse(value));
         resolve(value);
      }
    })
  });
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

function getDataforStarSearch(key){
  return new Promise((resolve,reject)=>{
    db.get(key, function(err, value) {
      if (err) {
        reject(err);
      }
      else{
         let body = JSON.parse(value);
         console.log(body);
         if (body.body){
          body.body.star.storyDecoded = new Buffer(body.body.star.story, 'hex').toString();
         }
         resolve(body);
      }
    })
  });
}
// get db reference

function deleteData(key){
  return new Promise((resolve,reject)=>{
    db.del(key.toString(), function (err) {
      if (err){
        return resolve(err);
      }
      return reject("Something Wrong");
    });
  })
}
function getDbReference(){
  return db;
}

module.exports = { addLevelDBData, getLevelDBData ,getDbReference,getDataforStarSearch,deleteData};
