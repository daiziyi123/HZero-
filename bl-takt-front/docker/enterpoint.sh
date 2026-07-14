#!/bin/bash
###
 # @Description:
 # @Author: <yang.ni01@hand-china.com>
 # @Date: 2023-06-14 10:18:31
 # @LastEditTime: 2025-02-17 10:40:15
 # @LastEditors: <LI.YANG04@HAND-CHINA.COM>
###
set -e

# 以下为原有配置
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH ${BUILD_BASE_PATH:-/} g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
# find /usr/share/nginx/html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
# find /usr/share/nginx/html -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
# find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
# find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_IM_ENABLE $BUILD_IM_ENABLE g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_IM_WEBSOCKET_HOST $BUILD_IM_WEBSOCKET_HOST g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TRACE_LOG_ENABLE $BUILD_TRACE_LOG_ENABLE g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_CUSTOMIZE_ICON_NAME $BUILD_CUSTOMIZE_ICON_NAME g"

# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_VUE_APP_HTTP_BASE_URL $BUILD_VUE_APP_HTTP_BASE_URL g"

# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_AIGC_HOST $BUILD_AIGC_HOST g"

# find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_MOBILE_API_HOST $BUILD_API_HOST g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_MOBILE_PREVIEWER_HOST $BUILD_MOBILE_PREVIEWER_HOST g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_FEIDA_MOBILE_ACCESS_URL $BUILD_MOBILE_PREVIEWER_HOST g"

# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_HMES_BASIC /key-focus-mes g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_COMMON /key-focus-tznc g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_HRPT_COMMON /hrpt g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_MODEL /key-focus-tznm g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_REPORT /key-focus-tznr g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_METHOD /key-focus-tznd g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_SAMPLING /key-focus-tznq g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_HSPC /key-focus-tzns g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_TARZAN_HOHR /key-focus-mes g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_APS_METHODTZND /key-focus-tznd g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_APS_COMMON /key-focus-tznc g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_APS_METHOD /key-focus-aps g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_POOL_QUERY query g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPLAN /key-focus-aps-mltp g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVERPURCHASE /key-focus-aps-purchase g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_BASE_SERVER /key-focus-aps g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_CUSZ_CODE_BEFORE KEY_FOCUS g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_LOV_CODE_BEFORE MT g"
# find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_API_PREFIX /aori g"
# 以上为原有配置


# 以下为适配灵衍的配置
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_BASE_PATH ${BUILD_BASE_PATH:-/} g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find /usr/share/nginx/html -name '*.css' | xargs sed -i "s /BUILD_PUBLIC_URL/ ${BUILD_PUBLIC_URL:-/} g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_IM_ENABLE $BUILD_IM_ENABLE g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_IM_WEBSOCKET_HOST $BUILD_IM_WEBSOCKET_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TRACE_LOG_ENABLE $BUILD_TRACE_LOG_ENABLE g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_CUSTOMIZE_ICON_NAME $BUILD_CUSTOMIZE_ICON_NAME g"

find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_VUE_APP_HTTP_BASE_URL $BUILD_VUE_APP_HTTP_BASE_URL g"

find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_AIGC_HOST $BUILD_AIGC_HOST g"

find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_MOBILE_API_HOST $BUILD_API_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_MOBILE_PREVIEWER_HOST $BUILD_MOBILE_PREVIEWER_HOST g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_FEIDA_MOBILE_ACCESS_URL $BUILD_MOBILE_PREVIEWER_HOST g"

find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_HMES_BASIC /key-focus-mes g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_COMMON /key-focus-tznc g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_HRPT_COMMON /hrpt g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_MODEL /key-focus-tznm g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_REPORT /key-focus-tznr g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_METHOD /key-focus-tznd g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_SAMPLING /key-focus-tznq g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_HSPC /key-focus-tzns g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_AIGC /aim g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_HOHR /key-focus-mes g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_APS_METHODTZND /key-focus-tznd g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_APS_COMMON /key-focus-tznc g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_APS_METHOD /key-focus-aps g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_POOL_QUERY query g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVERPLAN /key-focus-aps-mltp g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVERPURCHASE /key-focus-aps-purchase g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_BASE_SERVER /key-focus-aps g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_CUSZ_CODE_BEFORE KEY_FOCUS g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_LOV_CODE_BEFORE MT g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_API_PREFIX /aori g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_TARZAN_EAM /eori g"
# 以上为适配灵衍的配置


exec "$@"
