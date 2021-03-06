# Linux distro with node.js pre-installed
FROM node:9-alpine
# My credentials
LABEL maintainer "Yukine <DevYukine@gmx.de>"
# Workdir
WORKDIR /usr/src/Senpai
# Copy package.json and yarn.lock for Yarn
COPY package.json yarn.lock ./
# Install dependencies 
RUN apk add --update \
&& apk add --no-cache ffmpeg opus pixman cairo pango giflib ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl pixman-dev cairo-dev pangomm-dev libjpeg-turbo-dev giflib-dev python g++ make \
# Install node.js dependencies
\
&& yarn install \
# Clean up build dependencies
&& apk del .build-deps
# Add project source
COPY . .
# Enviroment variables
ENV bottoken=\
    prefix=\
    osuToken=\
    googleAPIKey=\
    owmAPIKey=\
    dBotsToken=\
    discordBotsToken=\
    supportServerLink=\
    voteLink=\
    pixabayToken=\
    databaseName=\
    databaseUser=\
    databasePW=\
    databaseHost=
# Run command
CMD ["node", "."]
