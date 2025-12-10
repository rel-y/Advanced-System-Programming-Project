#include "TCPServer.h"

TCPServer::TCPServer(IThreadManager& threadManager, int port): threadManager(threadManager) {
    //creating the socket, binding and listening
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        throw std::runtime_error("error creating socket");
    }
    //binding the socket on the given port
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        throw std::runtime_error("error binding socket");
    }
    //setting max amount of client that can connect to server
    if (listen(sock, 10) < 0) {
        throw std::runtime_error("error listening to a socket");
    }
    socketID = sock;
}
void TCPServer::acceptClient(){
    //accepting a client
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    std::cout << "socketID = " << socketID << "\n";
    int client_sock = accept(socketID,  (struct sockaddr *) &client_sin,  &addr_len);

    if (client_sock < 0) {
        throw std::runtime_error("error accepting client");
    }

    threadManager.runThread([this, client_sock]() {
        this->setUpConnection(client_sock);
    });

}
void TCPServer::setUpConnection(int sock){
    //creating TCPDevices and CLIDevice for the run function and running App
    TCPDevice* device = new TCPDevice(sock);
    ServerApp* app = setUpApp(device);
    app->run();

}
ServerApp* TCPServer::setUpApp(TCPDevice* device){
    std::map<std::string, ICommand*> commands;
    
    ICommand* addCommand = new Add();
    commands["post"] = addCommand;
    
    ICommand* getCommand = new Get();
    commands["get"] = getCommand;

    ICommand* searchCommand = new Search();
    commands["search"] = searchCommand;
    
    ICommand* deleteCommand = new Delete();
    commands["delete"] = deleteCommand;

    std::map<int, std::string> statusString = {
        {200, "OK\n\n"},
        {201, "Created\n"},
        {204, "Created\n"},

        {400, "Not Found\n"},
        {404, "Bad Request\n"},

        {500, "Internal Server Error\n"},
    };


    ServerApp* app = new ServerApp(device, commands, statusString);
    return app;
}
void TCPServer::run(){
    while(true){
        //accepting clients
        acceptClient();
    }
}