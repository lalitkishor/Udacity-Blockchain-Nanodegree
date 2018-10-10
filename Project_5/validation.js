const coinMessage = require('bitcoinjs-message');
const levelDb = require('./levelSandbox.js');
const blockchain = require('./simpleChain.js');


verifyParameterAndSaveNewData = (body)=>{
    return new Promise((reject,resolve)=>{

        const {address,star} = body;
        console.log(address,star);
        if (star.hasOwnProperty("dec") && typeof star.dec === "string" && star.hasOwnProperty("ra") && typeof star.ra === "string" && star.hasOwnProperty("story") && typeof star.story === "string"){
            if ((/^[\x00-\x7F]*$/.test(star.story)) && (Buffer(star.story).length > 500) ){
                return resolve ("String is not ASCCI or string length is longer than 500");
            }
            else{
                star.story = new Buffer(star.story).toString('hex');
                body = {address,star}
                levelDb.getLevelDBData(address).then((d)=>{
                    let b = JSON.parse(d);
                     if (b.messageSignature == "valid"){
                        blockchain.addBlockInStarChain(body).then(function(block){
                            // once a user add block del the address
                            levelDb.deleteData(address).then((data)=>{
                                return resolve(data);
                            }).catch((e)=>{
                                return reject(e);
                            });
                            return resolve(JSON.parse(block));
                        }).catch((e)=>{
                            reject(e);
                        });
                    }
                    else{
                        return resolve ("signature is not valid");
                    }
                }).catch(()=>{

                });
            } 
        }
        else{
            return reject ("Invalid star data");
        }
    });
}
varifyAndSaveNewrequest = (address) => {
    return new Promise((rejest, resolve) => {
        levelDb.getLevelDBData(address).then((data) => {
            const body = JSON.parse(data);
            if (body.requestTimeStamp < (Date.now() - (5 * 60 * 1000))) {
                const validationWindow = 300;
                const requestTimeStamp = Date.now();
                const starRegistry = "starRegistry";
                const message = `${address}:${requestTimeStamp}:${starRegistry}`;
                let body = {
                    address,
                    requestTimeStamp,
                    message,
                    validationWindow
                }
                levelDb.addLevelDBData(address, body);
                resolve(JSON.stringify(body));
            }
            else {
                console.log(body.address);
                body.validationWindow = getWindow(body.requestTimeStamp);
                resolve(body);
            }
        }).catch((e) => {
            if (e.type == 'NotFoundError') {
                const validationWindow = 300;
                const requestTimeStamp = Date.now();
                const starRegistry = "starRegistry";
                const message = `${address}:${requestTimeStamp}:${starRegistry}`;
                let body = {
                    address,
                    requestTimeStamp,
                    message,
                    validationWindow
                }
                levelDb.addLevelDBData(address, body);
                resolve(JSON.stringify(body));
            }
            else {
                rejest(`Something Wrong , ${e.message}`);
            }
        });
    });
}

verifyMessageSignature = (address, signature) => {
    return new Promise((reject, resolve) => {
        levelDb.getLevelDBData(address).then((data) => {
            let body = JSON.parse(data);
            let verify = false;

            if (body.messageSignature === 'valid') {
                return resolve({
                    "registerStar": true,
                    "status": body
                })
            }
            if (body.requestTimeStamp < (Date.now() - (5 * 60 * 1000))) {
                return resolve("Window experied hit again  http://localhost:8000/requestValidation");
            }
            else {

                try {
                    verify = coinMessage.verify(body.message, address, signature);
                }
                catch (e) {
                    console.log("sign error");
                }

                //  console.log("value====>>>>>>>>>",coinMessage.verify(body.message, address, signature))
                console.log(body);
                body.validationWindow = getWindow(body.requestTimeStamp);
                body.messageSignature = verify ? 'valid' : 'invalid';
                // add message Signature in body
                levelDb.addLevelDBData(address, body);
                return resolve({
                    "registerStar": verify,
                    "status": body
                })
            }
            
        }).catch((e) => {
            reject(e.message);
        });
    })
}

function getWindow (requestTimeStamp){
    return Math.floor((requestTimeStamp - (Date.now() - (5 * 60 * 1000))) / 1000);
}

module.exports = { verifyMessageSignature, varifyAndSaveNewrequest , verifyParameterAndSaveNewData };
