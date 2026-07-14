<!--
 * @Description: 
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-06-14 10:18:31
 * @LastEditTime: 2023-06-15 11:52:07
 * @LastEditors: <yang.ni01@hand-china.com>
-->
`key-focus-front`

## 本地开发启动

开发两种方案

1. 单模块启动: 本地编译调试速度快
2. 全模块启动: 适合做集成测试

#### 1. 单模块启动
```
在项目根目录下依次执行

安装依赖
yarn bootstrap

成功后进入package/hcm-mes-front目录，执行如下命令即可启动
yarn start
```

#### 2.根目录下全模块启动
```
在项目根目录下依次执行

1.安装依赖
yarn bootstrap

2.本地构建公共资源
yarn hzero-build:dep-all

3.本地构建hzero-front
yarn build:ms-dev hzero-front

4.本地构建所有模块/本地构建单一模块(例如hcm-mes-front)
yarn build:ms-dev-all / yarn build:ms-dev hcm-mes-front

5.根目录下启动
yarn start
```

### 打包发布
```
1.安装依赖
yarn bootstrap
2.构建公共资源
yarn hzero-build:dep-all
3.构建hzero-front资源
yarn build:ms hzero-front
4.构建父模块相关资源
yarn build:app:prod
5.打包子应用
yarn build:ms-all
即可生成dist包

增量发布命令：build:ms-all

然后需要替换变量，以西安环境为例执行的是的/data/tarzan/front/front-run.sh脚本

#!/bin/sh -l
cd /data/tarzan/front/
tar -zxvf ./dist.tar.gz ./;
find dist -name '*.js' | xargs sed -i "s BUILD_BASE_PATH ${BUILD_BASE_PATH:-/} g"
find dist -name '*.js' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find dist -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find dist -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find dist -name '*.js' | xargs sed -i "s BUILD_API_HOST http://10.216.4.21:8080 g"
find dist -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID tarzan-mes g"
find dist -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST ws://10.216.4.21:8080/hpfm/websocket g"
find dist -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION SAAS g"
find dist -name '*.js' | xargs sed -i "s BUILD_IM_ENABLE false g"
find dist -name '*.js' | xargs sed -i "s localhost tarzan-mes g"

find dist -name '*.js' | xargs sed -i "s BUILD_HMES_BASIC /key-focus-mes g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_COMMON /key-focus-tznc g"
find dist -name '*.js' | xargs sed -i "s BUILD_HRPT_COMMON /hrpt g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_MODEL /key-focus-tznm g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_REPORT /tznr g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_METHOD /tznd g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_SAMPLING /key-focus-tznq g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_HSPC /tzns g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_AIGC /aim g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_MONGO /tzng g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_HOHR /key-focus-mes g"

find dist -name '*.js' | xargs sed -i "s BUILD_POOL_QUERY query g"
find dist -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPURCHASE /aps-purchase g"
find dist -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPLAN /aps-mltp g"
find dist -name '*.js' | xargs sed -i "s BUILD_BASE_SERVER /aps g"
find dist -name '*.js' | xargs sed -i "s BUILD_APS_METHODTZND /tznd g"
find dist -name '*.js' | xargs sed -i "s BUILD_APS_COMMON /key-focus-tznc g"
find dist -name '*.js' | xargs sed -i "s BUILD_APS_METHOD /aps g"
find dist -name '*.js' | xargs sed -i "s BUILD_TARZAN_METHODTZND /tznd g"

rm -rf html
mv dist html
rm -fr ./dist.tar.gz;

最终生成一个html文件夹
用Nginx启动指向html文件夹中的index.html即可
```
### srm模块下载
srm模块相关依赖在甄云的代码仓库中，如果删除了yarn.lock文件，需要重新下载依赖。
```
yarn add srm-front-boot@1.24.9-op-1.44 srm-front-sfin-op@1.9.0-alpha.0 srm-front-sinv-op@1.9.0-alpha.1 srm-front-sitf-op@1.9.0-alpha.0 srm-front-smdm-op@1.9.0-alpha.1 srm-front-sodr-op@1.9.0-alpha.4 srm-front-spcm-op@1.9.0-alpha.0 srm-front-spfm-op@1.9.0-alpha.8 srm-front-sprm-op@1.9.0-alpha.0 srm-front-sqam-op@1.9.0-alpha.0 srm-front-srpm-op@1.9.0-alpha.0 srm-front-sslm-op@1.9.0-alpha.2 srm-front-ssrc-op@1.9.0-alpha.3 srm-front-ssta-op@1.9.0-alpha.0 srm-front-smpc-op@1.9.0-alpha.4  --registry http://nexus.going-link.com/repository/zhenyun-npm-group -W
```