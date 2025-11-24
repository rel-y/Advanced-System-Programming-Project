FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/myapp
COPY . /usr/src/myapp
RUN mkdir ../files
ENV FolderName=/usr/src/files

RUN mkdir build
WORKDIR /usr/src/myapp/build

RUN cmake ../tests/get && make

CMD [ "./runTests" ]
