# Advanced-System-Programming-Project

https://github.com/rel-y/Advanced-System-Programming-Project-Part-4

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, like google drive.
**The app functions as such:**

1. a file backup system is operating in the background.
2. a node server acts as a front for the system.
3. a react app is used for frontend.
### How The App Works

#### Signup and Login
Users may signup via the url localhost:3000/api/users/signup, and login via localhost:3000/api/users/signin.
if a user is not signed in, they are automatically transfered to these pages.
the App uses JWTs for communication authentication.

#### Main Page
After logging in, the user is greeted with their drive. it shows them their file list, a side bar with various options for files to show, an add file & folder buttons, and a search feature.

#### The Files List
once clicking on a file, the user is transfered to viewing the file. there they are met with (if they are allowed to) edit file & edit permissions features. here users may also download files.
once clicking a folder, the list is updated to show the files and folders within the selected folder.
users may also right-click files/folders and this transfers them to view the file/folder (and can for example, edit a folder's name like this).

#### The Side Bar
the user is prompted with their drive, their starred items, their trash, files shared with them and recent items.
here the user may also create a new file or folder, which will be rooted in the current directory in the list.

#### The Top Bar
the user has access to the search bar here. once used, all files/folders with matching names/content will appear.
here we also see the light/dark mode toggle.

#### Log Out
click on the profile photo and a log out button will appear.

### How To Run The App
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

### Example Run

**an example run is added in it's own folder.**


