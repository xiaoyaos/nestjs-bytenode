
# nestjs-bytenode

A minimalist bytecode compiler for Node.js.

该包依赖 bytenode ，bytenode包支持源码或者文件编译成字节码，[bytenode](https://github.com/OsamaAbbas/bytenode "bytenode")

因为bytenode的操作新性更强，不同的项目可能会涉及到不同的项目目录，如果要批量编译js到字节码需要手动写一些逻辑，那么nestjs-bytenode包便是在nestjs框架的基础上更便捷的编译dist目录下的源码，生成的字节码文件会统一到你的项目根目录下的bytenode-run目录下

---

## Install
globally install:

```console
sudo npm install -g bytenode
```

```console
npm install --save nestjs-bytenode
```

### 你只需要在你的nestjs项目根目录下添加一个js文件，内容如下
usage
```
const nestJsByteNode = require('nestjs-bytenode');
const path = require('path');

nestJsByteNode.compileMain(__dirname, './dist', {nodeModulesPack: true});
```

# Bytenode API
compileMain(rootDir, originDir, options)

name | type |  Description  
-|-|-
rootDir | string | 项目根目录 |
originDir | string | nest build目录 |
options | object |  |
options.nodeModulesPack | bool | 是否复制nodu_modules目录到bytenode-run |