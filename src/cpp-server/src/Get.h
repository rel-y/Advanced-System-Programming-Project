#ifndef GET_H
#define GET_H
#include "ICommand.h"
#include "Rle.h"
#include <filesystem>
#include <iostream>
#include <fstream> 
#include <string>
class Get: public ICommand {
public: 
    std::pair<int, std::string> execute(std::string argv) override;
};
#endif // GET_H