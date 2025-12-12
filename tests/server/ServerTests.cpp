#include <gtest/gtest.h>
#include "../../src/TCPServer.h"
#include "../../src/IThreadManager.h"
#include "../../src/Threads.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
TEST(ServerTests, CreatingAConnection) {
    Threads threadManager;
    int port = 12345;
    TCPServer* server = new TCPServer(threadManager, port);
    std::thread serverThread(&TCPServer::run, server);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    const char* ip_address = "127.0.0.1";
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock, 0);

    server->stop(); //only accepting one client


    //saving the server information in the sockaddr_in struct
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port);
    EXPECT_GE(connect(sock, (struct sockaddr *) &sin, sizeof(sin)), 0);
    //waiting the server finishes handeling the client
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    //closing everything
    close(sock);
    server->~TCPServer();
    serverThread.join();

}
TEST(ServerTests, MultipelClientConnection) {
    Threads threadManager;
    int port = 23456;
    TCPServer* server = new TCPServer(threadManager, port);
    std::thread serverThread(&TCPServer::run, server);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    const char* ip_address = "127.0.0.1";
    int sock1 = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock1, 0);

    //saving the server information in the sockaddr_in struct
    struct sockaddr_in sin1;
    memset(&sin1, 0, sizeof(sin1));
    sin1.sin_family = AF_INET;
    sin1.sin_addr.s_addr = inet_addr(ip_address);
    sin1.sin_port = htons(port);
    EXPECT_GE(connect(sock1, (struct sockaddr *) &sin1, sizeof(sin1)), 0);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    server->stop();

    int sock2 = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock2, 0);
    //saving the server information in the sockaddr_in struct
    struct sockaddr_in sin2;
    memset(&sin2, 0, sizeof(sin2));
    sin2.sin_family = AF_INET;
    sin2.sin_addr.s_addr = inet_addr(ip_address);
    sin2.sin_port = htons(port);
    EXPECT_GE(connect(sock2, (struct sockaddr *) &sin2, sizeof(sin2)), 0);
    //closing everything
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));

    close(sock1);
    close(sock2);
    server->~TCPServer();

    serverThread.join();
}
TEST(ServerTests, SendingTextsAndRecivingBack) {
    Threads threadManager;
    int port = 34567;
    TCPServer* server = new TCPServer(threadManager, port);
    std::thread serverThread(&TCPServer::run, server);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    const char* ip_address = "127.0.0.1";
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock, 0);
    
    server->stop();
    
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port);
    EXPECT_GE(connect(sock, (struct sockaddr *) &sin, sizeof(sin)), 0);
    TCPDevice device(sock);
    //message that will be sent to the server
    std::string data = "a";
    try{
        device.sendOutput(data);
    }catch(...){
        GTEST_FAIL() << "error sending data";
    }


    //receiving back from the server
    std::string output;
    try{
        output = device.getInput();
    }catch(...){
        GTEST_FAIL() << "error reciving data";
    }
    
    EXPECT_EQ("400 Bad Request\n", output); //the command sent isn't a real command the server accepts
    //closing everything
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));

    close(sock);
    server->~TCPServer();

    serverThread.join();
}
TEST(ServerTests, MultipelClientsSendingAndReciving) {
    Threads threadManager;
    int port = 45678;
    TCPServer* server = new TCPServer(threadManager, port);
    std::thread serverThread(&TCPServer::run, server);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    const char* ip_address = "127.0.0.1";
    int sock1 = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock1, 0);
    
    //saving the server information in the sockaddr_in struct
    struct sockaddr_in sin1;
    memset(&sin1, 0, sizeof(sin1));
    sin1.sin_family = AF_INET;
    sin1.sin_addr.s_addr = inet_addr(ip_address);
    sin1.sin_port = htons(port);
    EXPECT_GE(connect(sock1, (struct sockaddr *) &sin1, sizeof(sin1)), 0);
    int sock2 = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock2, 0);
    //saving the server information in the sockaddr_in struct
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    server->stop();

    
    struct sockaddr_in sin2;
    memset(&sin2, 0, sizeof(sin2));
    sin2.sin_family = AF_INET;
    sin2.sin_addr.s_addr = inet_addr(ip_address);
    sin2.sin_port = htons(port);
    EXPECT_GE(connect(sock2, (struct sockaddr *) &sin2, sizeof(sin2)), 0);
    TCPDevice device1(sock1);
    //message that will be sent to the server
    std::string data1 = "a";
    try{
        device1.sendOutput(data1);
    }catch(...){
        GTEST_FAIL() << "error sending data";
    }


    //receiving back from the server
    std::string output1;
    try{
        output1 = device1.getInput();
    }catch(...){
        GTEST_FAIL() << "error reciving data";
    }

    TCPDevice device2(sock2);
    std::string data2 = "delete a";
    try{
        device2.sendOutput(data2);
    }catch(...){
        GTEST_FAIL() << "error sending data";
    }


    //receiving back from the server
    std::string output2;
    try{
        output2 = device2.getInput();
    }catch(...){
        GTEST_FAIL() << "error reciving data";
    }

    EXPECT_EQ("400 Bad Request\n", output1); //the command sent isn't a real command the server accepts

    EXPECT_EQ("404 Not Found\n", output2); //the command sent isn't a real command the server accepts
    //closing everything
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));

    close(sock1);
    close(sock2);
    server->~TCPServer();
    serverThread.join();
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}