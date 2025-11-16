#include <gtest/gtest.h>
#include "../../src/Rle.h"


TEST(SaintyDecompressionTest, BasicDecompression) {
    std::string compressedData = {1,'a', 1,'b', 1,'c'};
    std::string expectedDecompressedData = "abc";

    std::string result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
    compressedData = {3,'A'};
    expectedDecompressedData = "AAA";

    result = decompress(compressedData);

    EXPECT_EQ(result, expectedDecompressedData);
}

TEST(ContainsnumberTest, BackslashHandling) {
    std::string compressedData = {3,'3', 4,'6'};
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
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}