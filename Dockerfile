FROM node:18-alpine

COPY . .

RUN npm install

RUN npm run build

ENV NODE_ENV='prod'

CMD ["node", "dist/main.js"]