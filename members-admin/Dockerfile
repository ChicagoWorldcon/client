FROM node:6

# from node:6-onbuild
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

ARG host=api-dev.chicagoworldcon.org:443
ARG title=Members
ARG node_env=production
ENV NODE_ENV="${node_env}" API_HOST="${host}" TITLE="${title}"
ENTRYPOINT ["./run-webpack.sh"]
CMD ["-p"]
