# Etapa 1: Compilación de React con Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# En la compilación inyectamos la URL del backend (opcional, si se pasa como build-arg)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine
# Copiamos los archivos compilados de React al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuramos nginx para que sirva la app de React correctamente (rutas de React Router) y escuche en el puerto 3002 internamente en el contenedor
RUN echo 'server { \
    listen 3002; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto
EXPOSE 3002

# Ejecutamos nginx
CMD ["nginx", "-g", "daemon off;"]
