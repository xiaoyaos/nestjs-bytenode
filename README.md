
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
options.nodeModulesPack | bool | 是否复制nodu_modules目录到bytenode-run, default:false |

# 注意
## 1.关于entities导入问题
```
TypeOrmModule.forRoot({
  type: database.client,
  host: database.connection.host,
  port: database.connection.port || 3306,
  username: database.connection.user,
  password: database.connection.password,
  database: database.connection.database,
  entities : [`${__dirname}/common/entities/*.{ts,js}`],
  synchronize: false,
}),
```
以上是nestjs项目中src/app.module.ts中关于数据库的配置，经过测试在某些情况下可能会失效或者出错，那么我们来讲一下解决方案

```
// 这里是手动导入entities目录，使用到的依赖库是require-dir,

var requireDir = require('require-dir');
var entitiesjson = requireDir('./common/entities/');
var entitiess = []
for (const key in entitiesjson) {
  if (entitiesjson.hasOwnProperty(key)) {
    const element = entitiesjson[key];
    // 因为我使用的是驼峰命名，但是读取的时候可能会存在首字母小写情况，故手动修复
    // 因为这里拿到的文件名被当做当前entitie默认导出名，所以这里各自使用者根据自身情
    // 况做修改
    let keyt = key.substr(0, 1).toUpperCase() + key.substr(1,);
    entitiess.push(element[keyt])
  }
}
···
// 这里使用手动获取到的entities数组代替原有entities导入方式
TypeOrmModule.forRoot({
  type: database.client,
  host: database.connection.host,
  port: database.connection.port || 3306,
  username: database.connection.user,
  password: database.connection.password,
  database: database.connection.database,
  entities: entitiess,
  // entities : [`${__dirname}/common/entities/*.{ts,js}`],
  synchronize: false,
}),
```
## 2.关于NestMiddleware实现自定义中间件，并在app.module.ts使用问题
```
// 这是一个实现nestjs-NestMiddleware的中间件
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    Logger.log(req.method + " " + req.path,'请求url');
    next();
  }
}
```
在app.module.ts文件中使用，这种用法，bytenode暂不支持
```
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogMiddleware).forRoutes('')
  }
}
```
建议采用原始方式加载该中间件，在main.ts中采用以下方式
```
app.use(new RequestLogMiddleware().use)
```