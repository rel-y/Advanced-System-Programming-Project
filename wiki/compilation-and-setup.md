## How To Run The App

On the main folder (Advanced-System-Programming-Project), run:

```
for linux:
SERVERIP=[host machine ip] docker-compose up -d --build
for windows:
$env:SERVERIP="[host machine ip]"; docker-compose up -d --build

```
building may take a minute.

[host machine ip] is the ip of the machine on which the containers are running. 
note that using 127.0.0.1 won't work even when running all containers on one pc because that refers to the ip of the containers themselves. check the ip the server is running on (for example on windows use ipconfig or on wsl use hostname -I, it is different from the ip of the windows machine).