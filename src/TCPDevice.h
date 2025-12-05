#ifndef TCPDEVICE_H
#define TCPDEVICE_H
#include "IIODevice.h"
#include <netinet/in.h>
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <vector>

class TCPDevice : public IIODevice {
private:
    int socketID;
public:
    std::string rest;
    TCPDevice(int sock);
    std::string getInput() override;
    void sendOutput(const std::string& output) override;
    ~TCPDevice() {
        close(socketID);
    }
};
#endif