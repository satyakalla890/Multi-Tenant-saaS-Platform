FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install postgres client for pg_isready
RUN apt-get update && apt-get install -y postgresql-client

RUN chmod +x scripts/start.sh

EXPOSE 5000

CMD ["sh", "scripts/start.sh"]
