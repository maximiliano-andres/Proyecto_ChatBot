FROM node:20

RUN mkdir -p /usr/src/PROYECTO-CHATBOT

WORKDIR /usr/src/PROYECTO-CHATBOT

# Copia solo package.json y package-lock.json primero para aprovechar la cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Luego copia el resto del códig
COPY . .

# Expone el puerto en el que la aplicación va a correr
EXPOSE 1010:2025

# Configura la variable de entorno DEBUG (puedes cambiar esto según tu configuración)
#ENV DEBUG=PROYECTO-CHATBOT

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]