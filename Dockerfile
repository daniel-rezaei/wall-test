FROM node:latest
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY jest.config.js ./
COPY src ./src

RUN npm install
EXPOSE 5000
CMD ["npm","run","test"]