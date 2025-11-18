#include "ICommand.h"
#include <iostream>
#include <fstream> 
#include <string>
#ifndef SEARCH_H
#define SEARCH_H
class Search: public ICommand {
public: static std::string search(std::string content);
};
#endif // SEARCH_H