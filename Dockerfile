# ==========================================
# Etapa 1: Compilación (Build)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# ==========================================
# Etapa 2: Producción (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx para SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados (ajusta 'dist' si tu build genera 'build' u otro directorio)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]