FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /frontend
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --silent

# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD ["npm", "start"]

