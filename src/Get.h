#include "ICommand.h"
#include "Rle.h"
#include <filesystem>
#include <iostream>
#include <fstream> 
#include <string>
#ifndef GET_H
#define GET_H
class Get: public ICommand {
public: 
    static std::string get(std::string name);
    void execute(std::string argv) override;
};
#endif // GET_H