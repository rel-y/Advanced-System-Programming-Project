#ifndef CommandLineDevice_H
#define CommandLineDevice_H
#include "IIODevice.h"
#include <iostream>
#include <string>
class CommandLineDevice : public IIODevice {
public:
    std::string getInput() override;
    void sendOutput(std::string output) override;
};
#endif