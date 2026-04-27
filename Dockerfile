FROM node:18

WORKDIR /app

COPY preventiva-pim-backend/package*.json ./
RUN npm install

COPY backend .

EXPOSE 3000
CMD ["npm", "start"]
