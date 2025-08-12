# Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY . .
# If your project name is set in angular.json, ng build will output to /app/dist
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
WORKDIR /

# SPA + /api proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets (covers both dist/<project> and dist/<project>/browser)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
