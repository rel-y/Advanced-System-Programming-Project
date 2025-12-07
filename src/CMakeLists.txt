cmake_minimum_required(VERSION 3.14)
project(my_project)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(runProject App.cpp CommandLineMenu.cpp something.cpp Rle.cpp Search.cpp Add.cpp Get.cpp BasicClient.cpp CommandLineDevice.cpp TCPDevice.cpp)
