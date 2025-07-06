# development stage
FROM node:22-bookworm-slim as development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} npm run build

# production stage
FROM node:22-bookworm-slim as production

WORKDIR /app

COPY --from=development /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]