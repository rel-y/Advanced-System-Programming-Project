#include <string>
#include"ICommand.h"
#ifndef SEARCH_H
#define SEARCH_H
class Search: public ICommand {
public: static std::string search(std::string content);
    void execute(std::string argv) override;
};
#endif // SEARCH_H