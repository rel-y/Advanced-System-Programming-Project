#include <gtest/gtest.h>
#include "../../src/TCPDevice.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
class TestClass : public ::testing::Test {
protected:
    std::unique_ptr<TCPDevice> client;
    std::unique_ptr<TCPDevice> server;
    int listen_sock = -1;

    void SetUp() override {
        listen_sock = createServerSocket();          // listening socket

        int client_sock = createClientSocket();      // client connects

        struct sockaddr_in client_sin;
        socklen_t addr_len = sizeof(client_sin);
        int server_sock = accept(listen_sock,
                                 (struct sockaddr*)&client_sin,
                                 &addr_len);

        ASSERT_GE(server_sock, 0) << "accept failed";

        client = std::make_unique<TCPDevice>(client_sock);
        server = std::make_unique<TCPDevice>(server_sock);
    }

    void TearDown() override {
        delete client.release();
        delete server.release();
        if (listen_sock >= 0) {
            close(listen_sock);
            listen_sock = -1;
        }
    }

    int createClientSocket() {
        const char* ip_address = "127.0.0.1";
        const int port_no = 5555;

        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock < 0) {
            perror("error creating socket");
            return -1;
        }

        struct sockaddr_in sin;
        memset(&sin, 0, sizeof(sin));
        sin.sin_family = AF_INET;
        sin.sin_addr.s_addr = inet_addr(ip_address);
        sin.sin_port = htons(port_no);

        if (connect(sock, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
            perror("error connecting to server");
            close(sock);
            return -1;
        }
        return sock;
    }

    int createServerSocket() {
        const int server_port = 5555;

        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock < 0) {
            perror("error creating socket");
            return -1;
        }

        struct sockaddr_in sin;
        memset(&sin, 0, sizeof(sin));
        sin.sin_family = AF_INET;
        sin.sin_addr.s_addr = htonl(INADDR_ANY);
        sin.sin_port = htons(server_port);

        if (bind(sock, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
            perror("error binding socket");
            close(sock);
            return -1;
        }

        if (listen(sock, 5) < 0) {
            perror("error listening to a socket");
            close(sock);
            return -1;
        }

        return sock;
    }
};
TEST_F(TestClass, siantyTest) {
    client->sendOutput("Hello, World!");
    std::string received = server->getInput();
    EXPECT_EQ(received, "Hello, World!");
    server->sendOutput("Hello back!");
    received = client->getInput();
    EXPECT_EQ(received, "Hello back!");
}
TEST_F(TestClass, multMassage) {
    client->sendOutput("Hello, World!");
    client->sendOutput("Hello, World!");
    std::string received = server->getInput();
    EXPECT_EQ(received, "Hello, World!");
    received = server->getInput();
    EXPECT_EQ(received, "Hello, World!");
    server->sendOutput("Hello back!");
    server->sendOutput("Hello back!");
    received = client->getInput();
    EXPECT_EQ(received, "Hello back!");
    received = client->getInput();
    EXPECT_EQ(received, "Hello back!");
}
TEST_F(TestClass, EmptyMessage) {
    client->sendOutput("");
    std::string received = server->getInput();
    EXPECT_EQ(received, "");
}
TEST_F(TestClass, LargeMessage) {
    std::string big(10000, 'x');  // 10k bytes
    client->sendOutput(big);
    std::string received = server->getInput();
    EXPECT_EQ(received.size(), big.size());
    EXPECT_EQ(received, big);
}
// TEST_F(TestClass, newline){ //the test is wrong input should only be 1 line
//     client->sendOutput("Hello\nWorld\n");
//     std::string received = server->getInput();
//     EXPECT_EQ(received, "Hello\nWorld\n");
// }
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}