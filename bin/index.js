#!/usr/bin/env node

var processor = require('../lib/fileProcessor')
process.argv.forEach(function (val, index, array) {

    if(index > 1){

        new processor().process(val)
    }

});