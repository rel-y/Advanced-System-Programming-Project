#ifndef COMMANDLINEMENU_H
#include "IMenu.h"
class CommandLineMenu: public IMenu{
public:
    std::vector<std::string> nextCommand() override;
};
#endif  //COMMANDLINEMENU_H
