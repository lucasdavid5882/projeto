# development stage

From node:22-bookworm-slim as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]

#Production stage

From node:22-bookworm-slim as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD ["node", "server.js"]