#include "ICommand.h"
#include "Rle.h"
#include <filesystem>
#include <iostream>
#include <fstream> 
#include <string>
#include <sys/stat.h>
#include <unistd.h>

#ifndef ADD_H
#define ADD_H
class Add: public ICommand {
    public:
    void execute(std::string argv) override;
};
#endif // ADD_H