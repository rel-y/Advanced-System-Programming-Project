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
#include <mutex>
class TCPServer{
private:
    IThreadManager& threadManager;
    int socketID;
    std::atomic<bool> running{true};
    std::vector<ServerApp*> runningApps;
    std::mutex runningAppsMutex;
public:
    TCPServer(IThreadManager& threadManager, int port);
    void acceptClient();
    void setUpConnection(int sock);
    void run();
    ~TCPServer();
    ServerApp* setUpApp(TCPDevice* device);
    void stop();
};

#endif //TCPSERVER_H