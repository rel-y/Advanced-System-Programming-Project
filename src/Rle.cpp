#include "Rle.h"
std::string Rle::decompress(std::string input) {
    std::string output = "";
    while(input.size() != 0) {
        int count = (int)input[0];
        char ch = input[1];
        input.erase(0,2);
        output.append(count, ch);
    }
    return output;
}
std::string Rle::compress(std::string input) {
    return "";
}