#!/usr/bin/env bash
###
 # @Description:
 # @Author: <yang.ni01@hand-china.com>
 # @Date: 2023-06-14 10:18:31
 # @LastEditTime: 2023-06-15 15:07:03
 # @LastEditors: <yang.ni01@hand-china.com>
###

# jenkins 脚本文件

set -e # 报错不继续执行

export TEMP_DIR=./.cache/
mkdir -p $TEMP_DIR

export REQUIRE_RE_NPM_INSTALL=false
export YARN_LOCK_CHANGE_LOG=""
if [ -f "$TEMP_DIR/.last_build_parent_git_head" ]; then
  export LAST_BUILD_PARENT_GIT_HEAD=`cat $TEMP_DIR/.last_build_parent_git_head` # 获取上一次 build 父项目时的 提交代码版本
  export CURRENT_GIT_HEAD=`git log -1 --pretty=format:"%H"` # 获取当前提交代码版本
  export YARN_LOCK_CHANGE_LOG=`git diff $LAST_BUILD_PARENT_GIT_HEAD $CURRENT_GIT_HEAD  --shortstat -- yarn.lock` # 对比两次提交版本中的 yarn.lock 是否变化
  if [[ -n "$YARN_LOCK_CHANGE_LOG" ]] ;then # 如果 yarn.lock 发生变化, 需要更新缓存。
    echo -e "gitlab-ci -- yarn.lock 发生变化, 需要清除之前编译时留下来的缓存。\n\t $YARN_LOCK_CHANGE_LOG"
    export REQUIRE_RE_NPM_INSTALL=true
  fi
else
  export REQUIRE_RE_NPM_INSTALL=true
fi
if  [[ $REQUIRE_RE_NPM_INSTALL =~ "true" ]] ;then
  rm -rf dll dist node_modules
  yarn install
  echo `git log -1 --pretty=format:"%H"` > $TEMP_DIR/.last_build_parent_git_head  # 保存当前 build 父项目时的 提交代码版本
fi

cat > src/config/.env.production.local.yml  << END

BASE_PATH: BUILD_BASE_PATH
PUBLIC_URL: /BUILD_PUBLIC_URL/
PLATFORM_VERSION: BUILD_PLATFORM_VERSION
CLIENT_ID: BUILD_CLIENT_ID
GENERATE_SOURCEMAP: false
API_HOST: BUILD_API_HOST
MOBILE_PREVIEWER_HOST: BUILD_MOBILE_PREVIEWER_HOST,
WEBSOCKET_HOST: BUILD_WEBSOCKET_HOST
SKIP_TS_CHECK_IN_START: false
SKIP_ESLINT_CHECK_IN_START: false
FILE_VIEW_HOST: BUILD_FILE_VIEW_HOST

END

yarn run build:production

rm -rf ./html
cp -r ./dist ./html

export BUILD_BASE_PATH=/
export BUILD_API_HOST=http://hzero-backend.open-front.hand-china.com
export BUILD_MOBILE_PREVIEWER_HOST=/
export BUILD_CLIENT_ID=localhost
export BUILD_WFP_EDITOR=""
export BUILD_PUBLIC_URL=/
export BUILD_WEBSOCKET_HOST=ws://ws.hzero-backend.open-front.hand-china.com
export BUILD_PLATFORM_VERSION=SAAS
export BUILD_BPM_HOST=http://bpm.hzero-backend.open-front.hand-china.com
export BUILD_IM_WEBSOCKET_HOST=ws://im.ws.hzero-backend.open-front.hand-china.com


# 以下为原有配置
# find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH $BUILD_BASE_PATH g"
# find ./html -name '*.js' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
# find ./html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
# find ./html -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_MOBILE_PREVIEWER_HOST $BUILD_MOBILE_PREVIEWER_HOST g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_IM_ENABLE $BUILD_IM_ENABLE g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_IM_WEBSOCKET_HOST $BUILD_IM_WEBSOCKET_HOST g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TRACE_LOG_ENABLE $BUILD_TRACE_LOG_ENABLE g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_CUSTOMIZE_ICON_NAME $BUILD_CUSTOMIZE_ICON_NAME g"

# find ./html -name '*.js' | xargs sed -i "s BUILD_HMES_BASIC /key-focus-mes g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_COMMON /key-focus-tznc g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_HRPT_COMMON /hrpt g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_MODEL /key-focus-tznm g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_REPORT /key-focus-tznr g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_METHOD /key-focus-tznd g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_SAMPLING /key-focus-tznq g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_HSPC /key-focus-tzns g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_TARZAN_HOHR /key-focus-mes g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_APS_METHODTZND /key-focus-tznd g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_APS_COMMON /key-focus-tznc g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH /key-focus-sqam g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_APS_METHOD /key-focus-aps g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_POOL_QUERY query g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPLAN /key-focus-aps-mltp g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPURCHASE /key-focus-aps-purchase g"
# find ./html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVER /key-focus-aps g"
# 以上为原有配置

# 以下为适配灵衍的配置
find ./html -name '*.html' | xargs sed -i "s BUILD_BASE_PATH $BUILD_BASE_PATH g"
find ./html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ $BUILD_PUBLIC_URL g"
find ./html -name '*.html' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find ./html -name '*.html' | xargs sed -i "s BUILD_MOBILE_PREVIEWER_HOST $BUILD_MOBILE_PREVIEWER_HOST g"
find ./html -name '*.html' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find ./html -name '*.html' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
find ./html -name '*.html' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
find ./html -name '*.html' | xargs sed -i "s BUILD_IM_ENABLE $BUILD_IM_ENABLE g"
find ./html -name '*.html' | xargs sed -i "s BUILD_IM_WEBSOCKET_HOST $BUILD_IM_WEBSOCKET_HOST g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TRACE_LOG_ENABLE $BUILD_TRACE_LOG_ENABLE g"
find ./html -name '*.html' | xargs sed -i "s BUILD_CUSTOMIZE_ICON_NAME $BUILD_CUSTOMIZE_ICON_NAME g"

find ./html -name '*.html' | xargs sed -i "s BUILD_HMES_BASIC /key-focus-mes g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_COMMON /key-focus-tznc g"
find ./html -name '*.html' | xargs sed -i "s BUILD_HRPT_COMMON /hrpt g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_MODEL /key-focus-tznm g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_REPORT /key-focus-tznr g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_METHOD /key-focus-tznd g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_SAMPLING /key-focus-tznq g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_HSPC /key-focus-tzns g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_AIGC /aim g"
find ./html -name '*.html' | xargs sed -i "s BUILD_TARZAN_HOHR /key-focus-mes g"
find ./html -name '*.html' | xargs sed -i "s BUILD_APS_METHODTZND /key-focus-tznd g"
find ./html -name '*.html' | xargs sed -i "s BUILD_APS_COMMON /key-focus-tznc g"
find ./html -name '*.html' | xargs sed -i "s BUILD_BASE_PATH /key-focus-sqam g"
find ./html -name '*.html' | xargs sed -i "s BUILD_APS_METHOD /key-focus-aps g"
find ./html -name '*.html' | xargs sed -i "s BUILD_POOL_QUERY query g"
find ./html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVERPLAN /key-focus-aps-mltp g"
find ./html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVERPURCHASE /key-focus-aps-purchase g"
find ./html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVER /key-focus-aps g"
# 以上为适配灵衍的配置


# 这里实现你的部署逻辑 deploy ./html

export CICD_EXECUTION_SEQUENCE=${BUILD_NUMBER:-1}
docker build . -t  hzero-front-sample:${CICD_EXECUTION_SEQUENCE}
docker rm -f hzero-front-sample 2>/dev/null
docker run --rm -it --name hzero-front-sample hzero-front-sample:${CICD_EXECUTION_SEQUENCE}
