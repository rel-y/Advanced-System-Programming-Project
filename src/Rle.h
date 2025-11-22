#include <string>
#ifndef RLE_H
#define RLE_H
class Rle{
public: static std::string decompress(std::string input);
public: static std::string compress(std::string input);};
#endif // RLE_H