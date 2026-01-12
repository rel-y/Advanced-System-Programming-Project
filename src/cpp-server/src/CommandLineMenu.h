#ifndef COMMANDLINEMENU_H
#define COMMANDLINEMENU_H
#include "IMenu.h"
#include <iostream>
class CommandLineMenu: public IMenu{
public:
    std::pair<std::string, std::string> nextCommand() override;
};
#endif  //COMMANDLINEMENU_H
