cmake_minimum_required(VERSION 3.14)
project(my_project)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(runCppClient Maincppclient.cpp BasicClient.cpp CommandLineDevice.cpp TCPDevice.cpp)

add_executable(runProject PoolThreadManager.cpp TCPServer.cpp TCPDevice.cpp ServerApp.cpp
Search.cpp Get.cpp Add.cpp Rle.cpp Delete.cpp ServerMain.cpp)