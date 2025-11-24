#include "Rle.h"
std::string Rle::decompress(std::string input) {
    std::string output = "";
    while(input.size() != 0) {
        int count = (int)((unsigned char)input[0]);
        char ch = input[1];
        // Remove the first 2 characters
        input.erase(0,2);
        // Append the charcter count amount of times
        output.append(count, ch);
    }
    return output;
}
std::string Rle::compress(std::string input) {
    std::string output = "";
    while (input.size() != 0)
    {
        char c = input[0];
        int sum = 0;
        for (int i = 0; i < 255; i++)
        {
            if (input[i] != c)
            {
                break;
            }
            sum++;
        }
        output.append(1, (char)sum);
        output.append(1, c);
        input.erase(0, sum);
    }
    return output;
}