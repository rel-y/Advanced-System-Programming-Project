# Advanced-System-Programming-Project

https://github.com/rel-y/Advanced-System-Programming-Project-Part-4

## Welcome To Our "Google-Drive" Project!
Our app is a file compression & backup system, like google drive.
**The app functions as such:**

1. a file backup system is operating in the background.
2. a node server acts as a front for the system.
3. a react-native app is used for frontend.
4. mongoDB is used for metadata and file structure saving.

### Our Work Process

we divided work between the three of us at the start. we did mongo migration, and worked simultaneously on the react-native. it was very similar to the previous exercise, so we had to think less about what goes where and the likes.

### How To Run The App

We use windows.
On the main folder (Advanced-System-Programming-Project), run:

```
$env:IP="<value>"
docker compose up react-native-app
```
building may take a minute.

if youre running on the emulator of android studio, use IP="10.0.2.2"
if youre running on a phone, set value to be your PC's LAN IPv4 adress.

if youre using linux, we dont even know how you managed to install android studio. gl!

## More Info At The Wiki!