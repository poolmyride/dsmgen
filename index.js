#!/usr/bin/env node
var appArguments = {};
var fileNames = []
var processor = require('./fileProcessor')
process.argv.forEach(function (val, index, array) {

    if(index > 1){

        new processor().process(val)
    }

});