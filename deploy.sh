git pull

docker rm -f finbot-api
docker image rm finbot-api:latest
docker build -t finbot-api:latest .
docker network create -d bridge --subnet 172.20.0.0/16 --gateway 172.20.0.1 finbot 
docker run -p 27019:27017 --name finbot-mongodb -d --network finbot --ip 172.20.0.2 -v /home/ckleest/finbot-data/db:/data/db --restart unless-stopped mongo:latest
docker run --name finbot -d -p 3000:3000 --network finbot --restart unless-stopped finbot-api:latest