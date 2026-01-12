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
private:
    int searchFile(std::filesystem::directory_entry file, std::string content);
public:
    std::pair<int, std::string> execute(std::string argv) override;
};
#endif // SEARCH_H