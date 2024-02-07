# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:20

# Create app directory
WORKDIR /opt/wiseblend

# Install app dependencies
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install chromium
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

# Bundle app source
COPY . .
# RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
