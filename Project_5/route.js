let levelDb = require('./levelSandbox.js');
let blockchain = require('./simpleChain.js');



let router = function (app) {
    app.get("/", function(req, res) {
      res.status(200).send("This is the default page. welcome to the blockchain restful api.");
    });
    app.get("/block/:key",function(req,res){
        let key = req.params.key;
        levelDb.getLevelDBData(key).then(function(data){
            res.status(200).send(JSON.parse(data));
        });
    });
    app.post("/block",function(req,res){
        let blockBody = req.body.body;
        blockchain.addBlockForAPI(blockBody.toString()).then(function(block){
            res.status(200).send(JSON.parse(block));
        });
    });
  }
module.exports = router;