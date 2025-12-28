#!/usr/bin/env node

const { program } = require('commander');
const { startServer } = require('../src/server');
const { clear } = require('../src/cache'); 

program
  .version('1.0.0')
  .description('A simple caching proxy server');

program
  .option('-p, --port <number>', 'Port to run the server on')
  .option('-o, --origin <url>', 'The URL to forward requests to')
  .option('--clear-cache', 'Clear the cached responses');

program.parse(process.argv);

const options = program.opts();

if (options.clearCache) {
    clear(); 
    
} else if (options.port && options.origin) {
    startServer(options.port, options.origin);

} else {
    console.log('Error: Please provide both --port and --origin');
    console.log('Example: caching-proxy --port 3000 --origin http://dummyjson.com');
}