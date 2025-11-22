#ifndef APP_H
#include "IMenu.h"
#include "ICommand.h"
#include <iostream>
#include <map>
#include <string>
#include <utility>
class App{
public:
    App(IMenu* menu, std::map<std::string, ICommand*> commands);
    void run();
private:
    std::map<std::string, ICommand*> commands;
    IMenu* menu;
};
#endif  //APP_H
