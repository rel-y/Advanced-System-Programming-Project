#include "BasicClient.h"

int main()
{
    BasicClient client("127.0.0.1", 12345);
    client.run();
    return 0;
}
