FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install -g

COPY . /usr/src/app

EXPOSE 3000



# Install MongoDB
#ENV MONGO_VERSION 3.0.4
#RUN curl -SL "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-$MONGO_VERSION.tgz" | tar -xz -C /usr/local --strip-components=1

# Setup DB data volume
#VOLUME /data/db

# Start MongoDB and a terminal session on startup
#ENV MONGOD_START "mongod --fork --logpath /var/log/mongodb.log --logappend --smallfiles"
#ENTRYPOINT ["/bin/sh", "-c", "$MONGOD_START && su dev && /bin/bash"]

ENV NODE_ENV production

CMD [ "npm", "start" ]




