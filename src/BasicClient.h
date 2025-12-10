#ifndef BASICCLIENT_H
#define BASICCLIENT_H

#include "CommandLineDevice.h"
#include "TCPDevice.h"

#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

class BasicClient {
    private:
    std::string ip;
    int portNum;
    CommandLineDevice cliDevice;
    TCPDevice tcpDevice = TCPDevice(-1); // no default constructor in TCPDevice. this is changed upon construction
    int sock;

    public:
    BasicClient(std::string ip, int portNum);
    ~BasicClient();
    void run();
};
#endif  //BASICCLIENT_H
