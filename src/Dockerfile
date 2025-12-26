FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/myapp

COPY /src ./src

ENV FolderName=/usr/myapp/files
#thread pool size
ENV POOL_SIZE=4 

RUN mkdir /usr/myapp/files

RUN cmake ./src && make

ENTRYPOINT [ "./runProject" ]
