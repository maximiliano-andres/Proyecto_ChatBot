FROM node:20

WORKDIR /usr/src/PROYECTO-CHATBOT

# Copia solo los archivos de dependencias
COPY package.json package-lock.json* ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto interno (debe coincidir con el .env)
EXPOSE 1010

# Comando para iniciar la aplicación (sin nodemon)
CMD ["node", "src/app.js"]
