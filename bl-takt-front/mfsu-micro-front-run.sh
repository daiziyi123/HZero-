echo 开始构建微前端
sudo yarn run build:ms hcm-common-front
sudo yarn run build:ms hcm-model-front
sudo yarn run build:ms hcm-mes-front
sudo yarn run build:ms hspc-front
sudo yarn run build:ms hcm-api-front
sudo yarn run build:ms hcm-model-front
sudo yarn run build:ms hcm-method-front
sudo yarn run build:ms hcm-report-front
sudo yarn run build:ms hcm-sampling-front
sudo yarn run build:ms hcm-hlct-front
sudo yarn run build:ms hcm-message-front

buildDate=$(date  "+%Y-%m-%d-%H-%M-%S")
product='key-focus-front'
env='dev'

echo 当前环境信息:
echo 构建时间:  $buildDate 产品名称:  $product 环境:  $env

imageName="registry.choerodon.com.cn/happs-hssp5/hone-${env}-${product}:${buildDate}"
echo $imageName

imageLatest="registry.choerodon.com.cn/happs-hssp5/hone-${env}-${product}:mfsu"
echo $imageLatest
echo 当前时间 $buildDate 开始构建镜像...

sudo docker build --pull -t $imageName .

echo 指定Tag:latest版镜像
sudo docker tag $imageName $imageLatest

echo 检测当前存在的images
sudo docker images

containerName="${product}-mfsu"
echo "容器名称 ${containerName}"

# 判断是否存在正在运行的latest 版容器
cmd="sudo docker ps | grep ${containerName}"
echo $cmd

if [ "$cmd" ]; then
    echo "检测到容器 ${containerName} 正在运行... 将自动停止、并删除"
    sudo docker stop $containerName
    sudo docker rm -f $containerName
    sudo docker ps
fi

echo 运行镜像
sudo docker run --name="hmes-front-mfsu" --rm -it -d -e BUILD_API_HOST=http://172.23.16.184:8080 -e BUILD_CLIENT_ID=hzero-front-dev -e BUILD_WEBSOCKET_HOST=ws://172.23.16.184:8080/hpfm/websocket -e BUILD_BPM_HOST=http://172.23.16.184:8080 -e BUILD_IM_ENABLE=false -p 32068:80 $imageLatest
