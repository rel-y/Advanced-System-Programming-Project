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
    IThreadManager* threadManager = new Threads();
    int port = 12345;
    TCPServer server(*threadManager, port);
    std::thread serverThread(&TCPServer::run, &server);

    const char* ip_address = "127.0.0.1";
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock, 0);
    
    //saving the server information in the sockaddr_in struct
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port);
    EXPECT_GE(connect(sock, (struct sockaddr *) &sin, sizeof(sin)), 0);
    //closing everything
    close(sock);
    delete(threadManager);
    serverThread.detach();
}
TEST(ServerTests, MultipelClientConnection) {
    IThreadManager* threadManager = new Threads();
    int port = 12345;
    TCPServer server(*threadManager, port);
    std::thread serverThread(&TCPServer::run, &server);

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
    struct sockaddr_in sin2;
    memset(&sin2, 0, sizeof(sin2));
    sin2.sin_family = AF_INET;
    sin2.sin_addr.s_addr = inet_addr(ip_address);
    sin2.sin_port = htons(port);
    EXPECT_GE(connect(sock2, (struct sockaddr *) &sin2, sizeof(sin2)), 0);
    //closing everything
    close(sock1);
    close(sock2);
    delete(threadManager);
    serverThread.detach();
}
TEST(ServerTests, SendingTextsAndRecivingBack) {
    IThreadManager* threadManager = new Threads();
    int port = 12345;
    TCPServer server(*threadManager, port);
    std::thread serverThread(&TCPServer::run, &server);

    const char* ip_address = "127.0.0.1";
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_GE(sock, 0);
    
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port);
    EXPECT_GE(connect(sock, (struct sockaddr *) &sin, sizeof(sin)), 0);

    //message that will be sent to the server
    char data_addr[] = "a\n";
    int data_len = strlen(data_addr);
    int sent_bytes = send(sock, data_addr, data_len, 0);
    EXPECT_EQ(sent_bytes, data_len);

    //receiving back from the server
    char buffer[4096];
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(sock, buffer, expected_data_len, 0);
    EXPECT_EQ("400 Bad Request\n", buffer); //the command sent isn't a real command the server accepts
    //closing everything
    close(sock);
    delete(threadManager);
    serverThread.detach();
}
TEST(ServerTests, MultipelClientsSendingAndReciving) {
    IThreadManager* threadManager = new Threads();
    int port = 12345;
    TCPServer server(*threadManager, port);
    std::thread serverThread(&TCPServer::run, &server);

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
    struct sockaddr_in sin2;
    memset(&sin2, 0, sizeof(sin2));
    sin2.sin_family = AF_INET;
    sin2.sin_addr.s_addr = inet_addr(ip_address);
    sin2.sin_port = htons(port);
    EXPECT_GE(connect(sock2, (struct sockaddr *) &sin2, sizeof(sin2)), 0);


    char data_addr1[] = "a\n";
    int data_len1 = strlen(data_addr1);
    int sent_bytes1 = send(sock1, data_addr1, data_len1, 0);
    EXPECT_EQ(sent_bytes1, data_len1);

    char data_addr2[] = "delete a\n"; //command is currect but not logical (file a dosn't exists)
    int data_len2 = strlen(data_addr2);
    int sent_bytes2 = send(sock2, data_addr2, data_len2, 0);
    EXPECT_EQ(sent_bytes2, data_len2);

    //receiving back from the server
    char buffer1[4096];
    int expected_data_len1 = sizeof(buffer1);
    int read_bytes1 = recv(sock1, buffer1, expected_data_len1, 0);
    EXPECT_EQ("400 Bad Request\n", buffer1); //the command sent isn't a real command the server accepts

    char buffer2[4096];
    int expected_data_len2 = sizeof(buffer2);
    int read_bytes2 = recv(sock2, buffer2, expected_data_len2, 0);
    EXPECT_EQ("404 Not Found\n", buffer2); //the command sent isn't a real command the server accepts
    //closing everything
    close(sock1);
    close(sock2);
    delete(threadManager);
    serverThread.detach();
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}