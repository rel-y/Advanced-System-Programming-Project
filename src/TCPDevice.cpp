#include "TCPDevice.h"
std::string TCPDevice::getInput() {
    return "";
}
void TCPDevice::sendOutput(const std::string& output) {
}
TCPDevice::TCPDevice(int sock): socketID(sock) { 
}