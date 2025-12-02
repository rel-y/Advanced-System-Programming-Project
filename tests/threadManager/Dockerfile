FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/myapp
COPY . .

ENV FolderName=/usr/src/files

RUN mkdir ${FolderName}

RUN mkdir build
WORKDIR /usr/src/myapp/build

RUN cmake ../tests/threadManager && make

CMD [ "./runTests" ]

