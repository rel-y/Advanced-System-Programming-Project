#ifndef SERVERAPP_H
#define SERVERAPP_H
#include "IIODevice.h"
#include "ICommand.h"
#include <iostream>
#include <map>
#include <string>
#include <utility>
class ServerApp{
private:
    std::map<std::string, ICommand*> commands;
    IIODevice* device;
    std::map<int, std::string> errorCodes;
public:
    ServerApp(IIODevice* device, std::map<std::string, ICommand*> commands, std::map<int, std::string> errorCodes);
    void run();
    std::pair<std::string, std::string> praseInput(std::string input);
    std::string praseStatusCode(int statusCode);
    std::string toLowerCase(std::string str);
};
#endif  //SERVERAPP_H
