#include "ICommand.h"
#include "Rle.h"
#include <filesystem>
#include <iostream>
#include <fstream> 
#include <string>
#include <algorithm>
#include <vector>
#ifndef SEARCH_H
#define SEARCH_H
class Search: public ICommand {
public: static std::string search(std::string content);
    void execute(std::string argv) override;
};
#endif // SEARCH_H