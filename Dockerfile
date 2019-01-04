FROM node
# 维护者信息
MAINTAINER yigg "yigg@163.com"

# Create app directory
RUN mkdir -p /home/node/BrandInquirer
WORKDIR /home/node/BrandInquirer

# Bundle app source
COPY . /home/node/BrandInquirer
RUN   npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone

CMD [ "node", "server.js" ]