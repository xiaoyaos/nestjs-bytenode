const nestJsByteNode = require('nestjs-bytebode');
const path = require('path');

nestJsByteNode.compileMain(__dirname, './dist', {nodeModulesPack: true});