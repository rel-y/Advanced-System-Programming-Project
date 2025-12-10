FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/myapp
COPY . .

ENV FolderName=/usr/src/files
RUN mkdir ${FolderName}

RUN mkdir build
WORKDIR /usr/myapp/build

RUN cmake ../tests/server && make

CMD [ "./runTests" ]
