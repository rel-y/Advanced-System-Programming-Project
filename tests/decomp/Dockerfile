
FROM gcc:latest

RUN apt-get update && apt-get install -y cmake


WORKDIR /usr/src/myapp
COPY . .

# Build directory
RUN mkdir build
WORKDIR /usr/src/myapp/build

# Configure using the CMakeLists.txt inside tests/
RUN cmake ../tests/decomp && make

CMD [ "./runTests" ]
