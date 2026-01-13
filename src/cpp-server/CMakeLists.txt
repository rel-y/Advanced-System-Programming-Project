cmake_minimum_required(VERSION 3.14)
project(my_project)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(runCppClient ./src/Maincppclient.cpp ./src/BasicClient.cpp ./src/CommandLineDevice.cpp ./src/TCPDevice.cpp)

add_executable(runProject ./src/PoolThreadManager.cpp ./src/TCPServer.cpp ./src/TCPDevice.cpp ./src/ServerApp.cpp
./src/Search.cpp ./src/Get.cpp ./src/Add.cpp ./src/Rle.cpp ./src/Delete.cpp ./src/ServerMain.cpp)