#ifndef TCPSERVER_H
#define TCPSERVER_H
#include "IThreadManager.h"
#include "ServerApp.h"
#include "TCPDevice.h"
#include "Add.h"
#include "Get.h"
#include "Search.h"
#include "Delete.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <iostream>
class TCPServer{
private:
    IThreadManager& threadManager;
    int socketID;
public:
    TCPServer(IThreadManager& threadManager, int port);
    void acceptClient();
    void setUpConnection(int sock);
    void run();
    ~TCPServer() = default;
    ServerApp* setUpApp(TCPDevice* device);
};

#endif //TCPSERVER_H