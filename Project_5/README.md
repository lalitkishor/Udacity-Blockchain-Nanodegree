# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Block height
my block chain height is start with zero index

### Restful framework
I used express.js for creating server.

### deployment
for deployment follow this step
 use npm install command and install all dependencies
 and app in listing on 8000 port

### How to run
simply run this command
    node index.js
    
### how to test
I used CURL

## GET Endpoints
  ###  Get request
      curl http://localhost:8000/block/blocknumber(like 0,1,2...)

  ### Post request
      curl -X "POST" "http://localhost:8000/block" \
      -H 'Content-Type: application/json' \
      -d $'{
        "body": "Testing block with test string data"
      }'
  
  