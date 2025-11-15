#include "ICommand.h"
class ICommand {
public:
    virtual void execute(std::string argv) = 0;
};