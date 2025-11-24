#include "CommandLineMenu.h"

std::pair<std::string, std::string> CommandLineMenu::nextCommand(){
    //we need to get input from user and returen a pair of strings
    std::string command;
    std::string parameters;
    std::cin >> command; //reading first word given from user (the commnad)
    getline(std::cin, parameters);
    if(!(parameters.empty()) && parameters.front() == ' '){ //checking if the parameter start with a space and removes it
        parameters.erase(0,1);
    }
    return {command,parameters};
}