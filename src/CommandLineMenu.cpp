#include "CommandLineMenu.h"

std::pair<std::string, std::string> CommandLineMenu::nextCommand(){
    //we need to get input from user and returen a pair of strings
    std::string command;
    std::string parameters;
    std::cin >> command; //reading first word given from user (the commnad)
    std::cin.ignore(); //ignoring first space in command
    getline(std::cin, parameters);
    return {command,parameters};
}