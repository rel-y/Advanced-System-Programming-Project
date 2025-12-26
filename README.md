# Advanced-System-Programming-Project

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, offering several commands for interaction with your files. over http.
**The app functions as such:**

1. a file backup system is operating in the background.
2. a node server acts as a front for the system.
3. users may send http reqs to the internet server.
### The Paths and Requests

#### /api/users
 - Post req creates a new user. in the body, the required params are: username, password, nickname, photo. passed as json. photo may be a string for convenience. 

 #### /api/users/:id
 - Get req gives the data of a user with username :id. a username must be passed in the request header.

 #### /api/tokens
 - Post req accepts username+password in req body, as json. checks if user exists.

#### /api/files
 - Get req gives list of all files and folders. a username must be passed in the request header.
 - Post req creates a new file/folder, its params are passed in req body. a username must be passed in the request header.

#### /api/files/:id
 - Get req gives metadata+data of file :id. a username must be passed in the request header.
 - Patch edits name + content of file :id. a username must be passed in the request header.
 - Delete req deletes file :id if possible. a username must be passed in the request header.

 #### /api/files/:id/permissions
 - Get req gives permission info of file/folder :id. a username must be passed in the request header.
 - Post req edits global permission info of file :id, param is passed in body. a username must be passed in the request header.

 #### /api/files/:id/permissions/pId
 - Patch req edits permission of person pId in regards to file/folder :id, param is passed in body. a username must be passed in the request header.
 - Delete req deletes permission of person pId in regards to file/folder :id. a username must be passed in the request header.

#### /api/search/:query
- Get req gives a list of files/folders with :query in their content/name. a username must be passed in the request header.


### How To Run The App
On the main folder (Advanced-System-Programming-Project):

**To Build Cpp Server:**
```
docker build -f ./src/Dockerfile -t server .
```
**To Run Cpp Server:**
```
docker run -p 12345:12345 server 12345
```
replace 12345 with whatever port you wish to use.

To run with persistence between runs, first run with
```
docker run --name myapp -p 12345:12345 -it server 12345
```
and on every subsequent run, run with
```
docker start -ai myapp
```


**To build JS Server:**
```
docker build -f .\src\web-server\Dockerfile -t web-server ./src/web-server
```

**To Run JS Server:**
```
docker run -p 8080:8080 -e SERVERIP=[cpp server ip] web-server
```
replace 8080 with whatever port you wish the internet server will listen to reqs on.
[cpp server ip] is the ip of the machine on which the server container is running. 
note that using 127.0.0.1 won't work even when running all containers on one pc because that refers to the ip of the container 'cppclient'. check the ip the server is running on (for example on windows use ipconfig or on wsl use hostname -I, it is different from the ip of the windows machine).
if you change cpp server from 12345 to something else like 3000, add in JS server run the flag -e PORT=3000.

### Example Run
**an example run is added in it's own folder. it has 20+ pictures in it, ordered.**

