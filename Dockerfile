FROM node:20.18-alpine
RUN apk add --no-cache openssl bash

WORKDIR /app

COPY package.json yarn.lock  ./

RUN yarn

COPY . .

RUN npx prisma generate && \
    npm run build

RUN chmod +x wait-for-it.sh

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
CMD ["/usr/local/bin/entrypoint.sh"]