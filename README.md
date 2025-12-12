# Advanced-System-Programming-Project

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, offering several commands for interaction with your files. 
**The app functions as such:**

1. multiple clients can connect to a server that manages the files.
2. On the clients' machine, a main console runs infinitely and accepts commands from the user, on the keyboard.
3. The console accepts the commands: post, get, search,, delete each having different functionality in regards to the file backup system. Commands are not case-sensetive.
### The Commands
#### Post
- This commands adds a new file to the system, and some content into it.
- If everything worked out, client receives 201 Created.
- Filenames may not contain spaces.
- Adding a File which already exists results in an error code, the original file will remain unchanged.

Syntax:
```
post [file name] [text]
```
#### Get
- This commands outputs the content of an existing file to the screen.
- Output is 200 Ok and then the text of the file.
- On illegal request client receives 400 Bad Requset.
- if no file was found client receives 404.

Syntax:
```
get [file name]
```
#### Search
- This command outputs a list of all files currently in the system, which contain the given content or have the content in their filename.
- on success, client receives 200 Ok and then the list of files.

Syntax:
```
search [file content]
```

#### Delete
- This command deletes a given file from the system.
- On success, client receives 204 No Content.
- On failure client receives an error code.

Syntax:
```
delete [file name]
```

### How To Run The App
On the main folder (Advanced-System-Programming-Project):

**To Build Server App:**
```
docker build -f ./src/Dockerfile -t server .
```
**To Run Server:**
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

**To Build Cpp Client:**
```
docker build -f ./src/Dockerfile.cppclient -t cppclient .
```
**To Run Cpp Client:**
```
docker run -it cppclient [server ip] 12345
```
where server ip is the ip of the machine on which the server container is running. 
note that using 127.0.0.1 won't work even when running all containers on one pc because that refers to the ip of the container 'cppclient'. check the ip the server is running on (for example on windows use ipconfig or on wsl use hostname -I, it is different from the ip of the windows machine).

**To Build Python Client:**
```
docker build -f ./src/Dockerfile.pythonclient -t pythonclient .
```
**To Run Python Client:**
```
docker run -it pythonclient [server ip] 12345
```


### Example Run
**The following pictures are of an example run of the code.**
Note that the two clients were running simultaneously and were connected to the same backup system, their files are shared.

<img width="884" height="54" alt="Screenshot 2025-12-12 203209" src="https://github.com/user-attachments/assets/60c71f52-8e80-4b92-aee8-4803af42167e" />

<img width="975" height="675" alt="Screenshot 2025-12-12 203158" src="https://github.com/user-attachments/assets/45dc619b-9f85-4cca-af5e-a73e0cdab1f5" />

<img width="973" height="637" alt="Screenshot 2025-12-12 203204" src="https://github.com/user-attachments/assets/3cf0d84c-c701-44a0-bda7-85363b5c9c46" />


### Questions from the Exercise
1. the fact that command names changed didn't require us to touch code that's "closed for changed and open for expansion". that is because we used a map of command names to actual functions, all that needed changing was the key string in the map.
2. the fact that new commands were added didn't require us to touch code that's "closed for changed and open for expansion". the new command 'delete' is independent from the other commands, and we just needed to update the map to include 'delete' and the according class.
3. the fact that command  output chaned did require us to edit code that is "closed for changed and open for expansion". we changed the Icommand signature to return a pair of a status code and an output text. the app then handles the output text after checking the status code and acts accordingly. this signature is more flexible then before where each command outputted to the console by itself.
4. the fact that i/o changed did require us to touch code that's supposed to be "closed for changed and open for expansion". before we had the commands output directly to console, now they just process requests and return code + output string to whoever called them.




