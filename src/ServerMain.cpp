#include "PoolThreadManager.h"
#include "TCPServer.h"
int main(int argc, char* argv[]){
    if(argc != 2){
        //didn't get port number
        return -1;
    }
    int portNumber;
    try{
        portNumber = std::stoi(argv[1]);
    }catch(...){
        //didn't get a number
        return -1;
    }
    PoolThreadManager threadManager;
    TCPServer* server = new TCPServer(threadManager, portNumber);
    server->run();

}