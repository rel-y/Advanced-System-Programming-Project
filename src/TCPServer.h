#ifndef TCPSERVER_H
#define TCPSERVER_H
#include "IThreadManager.h"

class TCPServer{
private:
    IThreadManager& threadManager;

public:
    TCPServer(IThreadManager& threadManager, int port);
    void accept();
    void setUpConnection(int sock);
    void run();
    ~TCPServer();
    
};

#endif //TCPSERVER_H