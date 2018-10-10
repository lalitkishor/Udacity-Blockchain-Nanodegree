const levelDb = require('./levelSandbox.js');
const blockchain = require('./simpleChain.js');
const validation = require('./validation.js');



let router = function (app) {
    app.get("/", function(req, res) {
      res.status(200).send("This is the default page. welcome to the blockchain restful api.");
    });
    app.get("/block/:key",function(req,res){
        let key = req.params.key;
        levelDb.getDataforStarSearch(key).then(function(data){
            res.json(data);
        });
    });
    app.get("/stars/address::address",function(req,res) {
        let key = req.params.address;
        blockchain.getBlockFromAddress(key).then((data)=>{
            res.json(data);
        });
    });
    app.get("/stars/hash::hash",function(req,res) {
        let key = req.params.hash;
        blockchain.getBlockFromHash(key).then((data)=>{
            res.json(data);
        });
    });
    app.post("/block",function(req,res){
        validation.verifyParameterAndSaveNewData (req.body).then((data)=>{
            res.json(data);
        }).catch((e)=>{
            console.log(e);
            res.status(200).send(e);
        });
    });

    app.post("/requestValidation",(req,res)=>{
        const address = req.body.address;
        validation.varifyAndSaveNewrequest(address).then((data)=>{
            res.json(JSON.parse(data));
        }).catch((e)=>{
            res.status(200).send(e);
        });
    });

    app.post('/message-signature/validate',(req,res)=>{
        const {address,signature} = req.body;
        validation.verifyMessageSignature(address,signature).then((data)=>{
            res.json(data);
        }).catch((e)=>{
            res.status(200).send(e);
        });
    });


  }
module.exports = router;