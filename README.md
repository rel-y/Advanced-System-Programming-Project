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
