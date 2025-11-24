# Advanced-System-Programming-Project
how to run the code:
while in the base folder run the command 
docker build -t myimage .
to compile
docker run -v mydata:/usr/src/files myimage

#delte before final submition
if your docker file for the test isn't in the base folder 
use flag -f PathToDocker 
exmple:
docker build -f ./tests/search/Dockerfile -t myimage .

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, offering several commands for interaction with your files. 
**The app functions as such:**

1. A main console runs infinitely and accepts commands from the user, on the keyboard.
2. The console accepts the commands: add, get, search, each having different functionality in regards to the file backup system.
### The Commands
#### Add
This commands adds a new file to the system, and some content into it.
It outputs no text to the screen.
Filenames may not contain spaces.
**Syntax:**
```
add [file name] [text]
```
#### Get
This commands outputs the content of an existing file to the screen.
If the file doesnt exist, the command outputs nothing.
**Syntax:**
```
get [file name]
```
#### Search
This command outputs a list of all files currently in the system, which contain the given content.
If no files match, the command outputs nothing.
**Syntax:**
```
search [file content]
```

### How To Run The App


### Example Run
**The following pictures are of an example run of the code.**
