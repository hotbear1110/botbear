#!/bin/bash
export NPM_CONFIG_LOGLEVEL="silent npm version"
printf "Your bot's Twitch username: "
read TWITCH_USER
printf "TWITCH_USER=${TWITCH_USER}" >> .env

printf "\nYour bot's Twitch OAuth: "
read TWITCH_PASSWORD
printf "\nTWITCH_PASSWORD=${TWITCH_PASSWORD}" >> .env

printf "\nYour bot's Twitch user ID: "
read TWITCH_UID
printf "\nTWITCH_UID=${TWITCH_UID}" >> .env

printf  "\nChoose a command prefix for your bot: "
read TWITCH_PREFIX
printf "\nTWITCH_PREFIX=${TWITCH_PREFIX}" >> .env

printf "\nBot's owner Twitch username: "
read TWITCH_OWNERNAME
printf "\nTWITCH_OWNERNAME=${TWITCH_OWNERNAME}" >> .env

printf "\nBot's owner Twitch user ID: "
read TWITCH_OWNERUID
printf "\nTWITCH_OWNERUID=${TWITCH_OWNERUID}" >> .env

printf "\nBot's client ID: "
read TWITCH_CLIENTID
printf "\nTWITCH_CLIENTID=${TWITCH_CLIENTID}" >> .env

printf "\nBot's Twitch bearer token: "
read TWITCH_AUTH
printf "\nTWITCH_AUTH=${TWITCH_AUTH}" >> .env

printf  "\nBot's Twitch secret token: "
read TWITCH_SECRET
printf "\nTWITCH_SECRET=${TWITCH_SECRET}" >> .env

printf  "\nDatabase name: "
read DB_DATABASE
printf "\nDB_DATABASE=${DB_DATABASE}" >> .env

printf "\nDatabase IP address (press enter for localhost): "
read DB_HOST
if [ -z "$DB_HOST" ]
then
      DB_HOST="127.0.0.1"
fi
printf "\nDB_HOST=${DB_HOST}" >> .env

printf "\nDatabase username (press enter for root): "
read DB_USER
if [ -z "$DB_USER" ]
then
      DB_USER="root"
fi
printf "\nDB_USER=${DB_USER}" >> .env

printf "\nDatabase password (press enter for empty): "
read DB_PASSWORD
if [ -z "$DB_PASSWORD" ]
then
      DB_PASSWORD=""
fi
printf "\nDB_PASSWORD=${DB_PASSWORD}" >> .env

printf "\nSupinic bot alive check user ID (press enter to skip): "
read SUPI_USERID
if [ -z "$SUPI_USERID" ]
then
      SUPI_USERID=""
fi
printf "\nSUPI_USERID=${SUPI_USERID}" >> .env

printf "\nSupinic bot alive check auth token (press enter to skip): "
read SUPI_AUTH
if [ -z "$SUPI_AUTH" ]
then
      SUPI_AUTH=""
fi
printf "\nSUPI_AUTH=${SUPI_AUTH}" >> .env

printf "\nRedis address (in a format of redis://username:password@ip:6379/db) (press enter to skip): "
read REDIS_ADDRESS
if [ -z "$REDIS_ADDRESS" ]
then
      REDIS_ADDRESS=""
fi
printf "\nREDIS_ADDRESS=${REDIS_ADDRESS}" >> .env

printf "\nOpenai API key (press enter to skip): "
read OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]
then
      OPENAI_API_KEY=""
fi
printf "\nOPENAI_API_KEY=${OPENAI_API_KEY}" >> .env