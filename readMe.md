# once we created .env file and saved our secret keys locally and gitignore this file we need to deploy our ode again and on prod too we need to add .env manually

## front end deployment steps:

============================
goto gitbash -> downloads -> ssh full command
$ cd devTinder-web/
$ git pull
$ npm run build
$ sudo scp -r dist/\* /var/www/html/
=====================

## Backend redeployment steps

======================
cd ../devTinder
git pull
npm install
pm2 list
pm2 stop npm (here npm is the process name )
then start again
pm2 start src/server.js --name devtinder-backend
=======================
from next on to redploy
=================
cd ~/devtinder
git pull
npm install # only if dependencies changed
pm2 restart devtinder-backend
===========
to add .env file on ec2 instance of backend

delete pm2 0
$ sudo nano .env
add our .env file content of local to here and to save ctrl + o (alphabet )
hit enter then ctrl X to exit
to see our env has been added correctly say cat .env
shows file content
==========
start again pm2
pm2 start src/server.js --name devtinder-backend
===========
full front end and backend with .env on backend done successfully
==============
multiple environments can have diff env files
like testing , staging, production etc..
read more about it here on npmjs.con/package/dotenv -> manage multiple environments
