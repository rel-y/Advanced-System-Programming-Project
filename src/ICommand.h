#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>
class ICommand {
public:
    virtual void execute(std::string argv) = 0;
};

#endif