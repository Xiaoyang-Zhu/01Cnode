var bitcoind = require("express").Router();
var config = require("config");
var bitcoinRPC = require("node-bitcoin-rpc");

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

config.get('Api.restCalls').forEach(function(entry){
    
    bitcoind.get(entry.uri, function(req, res) {
        var inputString = [];
        if(entry.inputType === 'string'){
            inputString.push(req.params[entry.inputName]);
        }
        else if(entry.inputType === 'number'){
            inputString.push(Number(req.params[entry.inputName]));
        }
        if(entry.verbose === true){
            inputString.push(1);
        }
        if(entry.timeout){
            bitcoinRPC.setTimeout(entry.timeout);
        }
                
        bitcoinRPC.call(entry.callName, inputString, function (error, value) {
           if(error) {
               res.sendStatus(404).end();
            }
            else{
                res.status(200).json(value.result).end();
            }
        });
    })
});

module.exports = bitcoind;