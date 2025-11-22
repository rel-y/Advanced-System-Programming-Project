#include "Rle.h"
std::string Rle::decompress(std::string input) {
    std::string output = "";
    while(input.size() != 0) {
        int count = (int)input[0];
        char ch = input[1];
        // Remove the first 2 characters
        input.erase(0,2);
        // Append the charcter count amount of times
        output.append(count, ch);
    }
    return output;
}
std::string Rle::compress(std::string input) {
    return "";
}