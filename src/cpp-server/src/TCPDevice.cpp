#include "TCPDevice.h"
std::string TCPDevice::getInput() {
    while (true) {
        // Check if we already have a full line in the buffer
        size_t pos = this->rest.find('\n');
        while(pos != std::string::npos) {
            if(pos > 0 && this->rest[pos - 1] == '\\') {
                // Escaped newline, continue searching
                pos = this->rest.find('\n', pos + 1);
                continue;
            }
            
            // Extract one line
            std::string line = this->rest.substr(0, pos);  // up to '\n', not including
            for(int i =0; i<line.size(); i++){
                if(line[i] == '\\' && (i + 1 < line.size()) && (line[i + 1] == '\n' || line[i + 1] == '\\'))
                {
                    line.erase(i,1);
                }
            }
            // Remove this line (and the '\n') from buffer
            this->rest.erase(0, pos + 1);
            return line;
        }

        // Need more data
        const int buffer_size = 4096;
        char buffer[buffer_size];

        ssize_t received_bytes = recv(socketID, buffer, buffer_size, 0);
        if (received_bytes < 0) {
            throw std::runtime_error("Error receiving data from TCP socket");//error while receiving massage
        } else if (received_bytes == 0) {
            return "";//client disconnected
        }
        //append the rest of the data to be recessed next time
        this->rest.append(buffer, received_bytes);
    }
}
void TCPDevice::sendOutput(std::string output) {
    for(int i =0; i<output.size(); i++){
        if(output[i] == '\n' || output[i] == '\\')
        {
            output.insert(i,1,'\\');
            i++;
        }
    }
    output += '\n'; // Append newline without \ to indicate end of message
    int read_bytes = output.size();
    int sent_bytes = send(socketID, output.c_str(), read_bytes, 0);
    if (sent_bytes < 0) {
        throw std::runtime_error("Error sending data over TCP socket");
    }
}
TCPDevice::TCPDevice(int sock): socketID(sock) { 
}