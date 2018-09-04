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
    // post for method address
    app.post("/block/address/signature",function(req,res){
        let blockaddress = req.body.address;
        let signature = req.body.signature;
        let star = req.body.star;
        let body = req.body.body;
        blockchain.addBlockWithTimeStemp(body.toString(),blockaddress.toString(),signature.toString(),star.toString()).then(function(){
            res.status(200).send("added");
        });
    })
    app.get("/stars/:address",function(req,res){
        let address = req.params.address;
        levelDb.getLevelDBData(address).then(function(data){
            res.status(200).send(JSON.parse(data));
        });
    });
  }
module.exports = router;