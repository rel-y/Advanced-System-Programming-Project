#ifndef DELETE_H
#define DELETE_H
#include "ICommand.h"
#include <filesystem>
class Delete: public ICommand {
public: 
    std::pair<int, std::string> execute(std::string argv) override;
};
#endif // DELETE_H