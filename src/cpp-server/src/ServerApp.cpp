#include "ServerApp.h"
ServerApp::ServerApp(IIODevice* device, std::map<std::string, ICommand*> commands, std::map<int, std::string> errorCodes) 
                        : device(device), commands(commands), errorCodes(errorCodes) {
                        }
void ServerApp::run(){
    while(running){
        std::pair<int, std::string> returnValue = {-1, ""};
        std::string input;
        bool errorF = false;
        try{
            input = device->getInput();
        }catch(const std::runtime_error& error){
            returnValue = {500, ""};
            errorF = true;
        }
        if(!errorF){
            std::pair<std::string, std::string> task = praseInput(input);
            
            try{
                
                auto command = commands.find(task.first);
                if(!(command == commands.end() || command->second == nullptr)){ //checking the commandexists so we don't get a segfault
                    returnValue = commands[task.first]->execute(task.second);
                }else{ // bad request, the command doesn't exists
                    returnValue = {400, ""};
                }
            }catch(...){//catching all exeptions
                returnValue = {500, ""};
            }
        }
        std::string returnString = std::to_string(returnValue.first) + " " + praseStatusCode(returnValue.first) 
                                + returnValue.second;
        
        try{
            device->sendOutput(returnString);
        }catch(const std::runtime_error& error){
            //there is an error sending data to client
            //can't send to client there is an error
        }
    }
}

std::pair<std::string, std::string> ServerApp::praseInput(std::string input){
    size_t spaceIndex = input.find(" ");
    std::string command = toLowerCase(input.substr(0, input.find(" "))); // commands are saved in lowerCase
    //in case parameters is empty
    std::string parameters = (spaceIndex == std::string::npos) ? "" : input.substr(input.find(" ")+1); // the rest of the string without the space
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
        return "coudn't find string\n";
    }
    return errorCodes[statusCode];
}
void ServerApp::stop(){
    running = false;
}