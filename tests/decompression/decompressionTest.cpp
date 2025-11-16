#include <gtest/gtest.h>
#include "../../src/Rle.cpp"
string decompress(std::string input); // Assume this function is defined elsewhere

TEST(SaintyDecompressionTest, BasicDecompression) {
    std::string compressedData = 1 + 'a' + 1 + 'b' + 1 + 'c';;
    std::string expectedDecompressedData = "abc";

    std::string result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
    std::string compressedData = 3 + 'A';
    std::string expectedDecompressedData = "AAA";

    std::string result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
}

TEST(ContainsnumberTest, BackslashHandling) {
    std::string compressedData = 3 + '3' + 4 +'6';
    std::string expectedDecompressedData = "3336666";

    std::string result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
}
TEST(EmptyStringDecompressionTest, EmptyInput) {
    std::string compressedData = "";
    std::string expectedDecompressedData = "";

    std::string result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
}
