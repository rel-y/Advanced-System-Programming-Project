#include "ServerApp.h"
ServerApp::ServerApp(IIODevice* device, std::map<std::string, ICommand*> commands, std::map<int, std::string> errorCodes) 
                        : device(device), commands(commands), errorCodes(errorCodes) {}
void ServerApp::run(){
    while(true){
        std::string input = device->getInput();
        std::pair<std::string, std::string> task = praseInput(input);
        std::pair<int, std::string> returnValue;
        try{
            auto command = commands.find(task.first);
            if(!(command == commands.end() || command->second == nullptr)){ //checking the commandexists so we don't get a segfault
                returnValue = commands[task.first]->execute(task.second);
            }

        }
        catch(...){//catching all exeptions
            returnValue = {400, ""};
        }
        std::string returnString = std::to_string(returnValue.first) + praseStatusCode(returnValue.first) 
                                + returnValue.second;
        device->sendOutput(returnString);
    }
}

std::pair<std::string, std::string> ServerApp::praseInput(std::string input){
    size_t spaceIndex = input.find(" ");
    std::string command = toLowerCase(input.substr(0, input.find(" "))); // commands are saved in lowerCase
    //in case parameters is empty
    std::string parameters = (spaceIndex == std::string::npos) ? "" : input.substr(input.find(" ")); // the rest of the string
    return {command, parameters};
}
std::string ServerApp::toLowerCase(std::string str){
    for (char &c : str) {
        c = std::tolower(c); // convert to lowercase
    }
    return str;
}
std::string ServerApp::praseStatusCode(int statusCode){
    auto codeString = errorCodes.find(statusCode);
    if(codeString == errorCodes.end()){
        return "Internal Server Error\n";
    }
    return errorCodes[statusCode];
}