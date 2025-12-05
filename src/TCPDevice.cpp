#include "TCPDevice.h"
std::string TCPDevice::getInput() {
    while (true) {
        // Check if we already have a full line in the buffer
        size_t pos = this->rest.find('\n');
        if (pos != std::string::npos) {
            // Extract one line
            std::string line = this->rest.substr(0, pos);  // up to '\n', not including

            // Remove this line (and the '\n') from buffer
            this->rest.erase(0, pos + 1);
            return line;
        }

        // Need more data
        const int buffer_size = 4096;
        char buffer[buffer_size];

        ssize_t received_bytes = recv(socketID, buffer, buffer_size, 0);
        if (received_bytes < 0) {
            throw std::runtime_error("Error receiving data from TCP socket");
        } else if (received_bytes == 0) {
            return "";
        }
        //append rest of data
        this->rest.append(buffer, received_bytes);
    }
}
void TCPDevice::sendOutput(const std::string& output) {
    std::string dataToSend = output;
    dataToSend += '\n';  // Append newline to indicate end of message
    int read_bytes = dataToSend.size();
    int sent_bytes = send(socketID, dataToSend.c_str(), read_bytes, 0);
    if (sent_bytes < 0) {
        throw std::runtime_error("Error sending data over TCP socket");
    }
}
TCPDevice::TCPDevice(int sock): socketID(sock) { 
}