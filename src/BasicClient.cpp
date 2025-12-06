#include "BasicClient.h"


BasicClient::BasicClient(std::string ip, int portNum) {
    this->ip = ip;
    this->portNum = portNum;
    const char* ipChars = ip.c_str();
    
    int sock = socket(AF_INET, SOCK_STREAM, 0); // create IPv4 TCP socket
    if (sock < 0) {
        perror("error creating socket");
    }

    struct sockaddr_in sin; // create struct that will describe the server connection
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ipChars);
    sin.sin_port = htons(portNum);

    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) { // connect to server. private socket connection will be set in sin
        perror("error connecting to server");
    }

    this->tcpDevice = TCPDevice(sock);
    this->cliDevice = CommandLineDevice();
}


void BasicClient::run() {
    while (true)
    {
        std::string toSend = cliDevice.getInput();
        tcpDevice.sendOutput(toSend);
        std::string received = tcpDevice.getInput();
        cliDevice.sendOutput(received);
    }
}