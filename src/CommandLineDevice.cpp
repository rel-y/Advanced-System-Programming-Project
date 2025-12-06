#include "CommandLineDevice.h"
std::string CommandLineDevice::getInput()
{
    std::string line;
    std::getline(std::cin, line);
    return line;
}
void CommandLineDevice::sendOutput(std::string output)
{
    std::cout << output;
}
