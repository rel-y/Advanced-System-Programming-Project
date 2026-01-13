#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string>
class ICommand {
public:
    virtual std::pair<int, std::string> execute(std::string argv) = 0;
};
#endif //ICOMMAND_H