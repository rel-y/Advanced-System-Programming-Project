#include <iostream>
#include <string>

#include "CommandLineDevice.h"
#include "TCPDevice.h"
#include "BasicClient.h"


int main(int argc, char const *argv[])
{
    if (argc != 3)
    {
        std::cout << "wrong usage" << std::endl;
    }
    std::string ip = argv[1];
    int port = atoi(argv[2]);

    BasicClient client(ip, port);
    client.run();

    return 0;
}
