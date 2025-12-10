# Advanced-System-Programming-Project

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, offering several commands for interaction with your files. 
**The app functions as such:**

1. A main console runs infinitely and accepts commands from the user, on the keyboard.
2. The console accepts the commands: add, get, search, each having different functionality in regards to the file backup system.
### The Commands
#### Add
- This commands adds a new file to the system, and some content into it.
- It outputs no text to the screen.
- Filenames may not contain spaces.
- Adding a File which already exists results in no action being completed, the original file will remain unchanged.

Syntax:
```
add [file name] [text]
```
#### Get
- This commands outputs the content of an existing file to the screen.
- If the file doesnt exist, the command outputs nothing.

Syntax:
```
get [file name]
```
#### Search
- This command outputs a list of all files currently in the system, which contain the given content.
- If no files match, the command outputs nothing.

Syntax:
```
search [file content]
```

### How To Run The App
On the main folder (Advanced-System-Programming-Project):

**To Build:**
```
docker build -f ./src/Dockerfile -t project .
```

**To Run:**
```
docker run -it project
```
To run with persistence between runs, first run with
```
docker run --name myapp -it project
```
and on every subsequent run, run with
```
docker start -ai myapp
```

### Example Run
**The following pictures are of an example run of the code.**

![WhatsApp Image 2025-11-24 at 22 57 26](https://github.com/user-attachments/assets/6ae4a7b1-9ec5-4072-8f78-58d52e587212)


### Questions from the Exercise
1. the fact that command names changed didn't require us to touch code that's "closed for changed and open for expansion". that is because we used a map of command names to actual functions, all that needed changing was the key string in the map.
2. the fact that new commands were added didn't require us to touch code that's "closed for changed and open for expansion". the new command 'delete' is independent from the other commands, and we just needed to update the map to include 'delete' and the according class.
3. the fact that command  output chaned did require us to edit code that is "closed for changed and open for expansion". we changed the Icommand signature to return a pair of a status code and an output text. the app then handles the output text after checking the status code and acts accordingly. this signature is more flexible then before where each command outputted to the console by itself.
4. the fact that i/o changed did require us to touch code that's supposed to be "closed for changed and open for expansion". before we had the commands output directly to console, now they just process requests and return code + output string to whoever called them.






