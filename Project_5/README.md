## Notary Service

 ### Configure Blockchain ID validation routine
 1. validate request end point 
    http://localhost:8000/requestValidation
   For posting data simply use curl or postman
   after that you got a respone in this format 
   ```
    {
    "address": "xxxxxxxxxxxxxxxxxxxxxxx",
    "requestTimeStamp": "yyyy",
    "message": "xxxxxxxxxxxxxxxxxxxxxxx:yyyy:starRegistry",
    "validationWindow": 300
    }
   ``` 
 2. Allow User Message Signature
    API End POINT 
    http://localhost:8000/message-signature/validate
     after that you got a response in this  format
     ```
        {
        "registerStar": true,
        "status": {
        "address": "xxxxxxxxxxxxxxxxxxxxxxx",
        "requestTimeStamp": "yyyy",
        "message": "xxxxxxxxxxxxxxxxxxxxxxx:yyyy:starRegistry",
        "validationWindow": zzz,
        "messageSignature": "valid"
        }
        }

    ```

 ### Configure Star Registration Endpoint
  1. you can simply post data 
   API End point http://localhost:8000/block
   pass payload "address" and "star"
   you got a response something like this
   ```
    {
    "hash": "xxxxxxxxxxxxxxxxxxxxxxxyyyyyyyyyyyyyyyyyyyyyyyyyyzzzzzzzzzz",
    "height": 1,
    "body": {
        "address": "xxxxxxxxxxxxxxxxxxxxxxx",
        "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "xyzyxyzyxyzxzyxyzyxyxyzyxyzzzzzzzzzzzzzzzxyzyxyzyxyzxyzx"
        }
    },
    "time": "yyyyy",
    "previousBlockHash": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
    }
```

## GET
 1. you can get a response according to  Blockchain Wallet Address
   end point : http://localhost:8000/stars/address::address
 2. get block fron block hash
   end point: http://localhost:8000/stars/hash::hash
 3. using block height
   end point http://localhost:8000/block/height // eg : height 0 ,1,2...