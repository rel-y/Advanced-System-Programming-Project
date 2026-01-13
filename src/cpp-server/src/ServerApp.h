#ifndef SERVERAPP_H
#define SERVERAPP_H
#include "IIODevice.h"
#include "ICommand.h"
#include <iostream>
#include <map>
#include <string>
#include <utility>
#include <atomic>
class ServerApp{
private:
    std::map<std::string, ICommand*> commands;
    IIODevice* device;
    std::map<int, std::string> errorCodes;
    std::atomic<bool> running{true};
public:
    ServerApp(IIODevice* device, std::map<std::string, ICommand*> commands, std::map<int, std::string> errorCodes);
    void run();
    std::pair<std::string, std::string> praseInput(std::string input);
    std::string praseStatusCode(int statusCode);
    std::string toLowerCase(std::string str);
    void stop();
};
#endif  //SERVERAPP_H
