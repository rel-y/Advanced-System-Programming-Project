## How To Run The App

We use windows.
On the main folder (Advanced-System-Programming-Project), run:

```
$env:SERVERIP="<host machine ip>"
$env:IP="<value>"
docker compose up
```
building may take a minute.

host machine ip is the ip of the machine on which the containers are running. 
note that using 127.0.0.1 won't work even when running all containers on one pc because that refers to the ip of the containers themselves. check the ip the server is running on (for example on windows use ipconfig).

if youre running on the emulator of android studio, use IP="10.0.2.2"
if youre running on a phone, set value to be your PC's LAN IPv4 adress.

if youre using linux, we dont even know how you managed to install android studio. gl!

![alt text](image-14.png)