FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/myapp
COPY . .

RUN mkdir build
WORKDIR /usr/src/myapp/build

RUN cmake ../tests/compress && make

CMD [ "./runTests" ]
