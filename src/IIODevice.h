#ifndef IIODEVICE_H
#define IIODEVICE_H
#include <string>
class IIODevice {
public:
    virtual std::string getInput() = 0;
    virtual void sendOutput(const std::string& output) = 0;
};
#endif