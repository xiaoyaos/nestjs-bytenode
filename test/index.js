const nestJsByteNode = require('nestjs-bytenode');
const path = require('path');

nestJsByteNode.compileMain(__dirname, './dist', {nodeModulesPack: true});