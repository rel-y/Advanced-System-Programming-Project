#include <gtest/gtest.h>
#include "../../src/Rle.h"

TEST(SanityTest, BasicStrings) {
    std::string data = "aaabbbbcbbd";
    std::string expected = {3, 'a', 4, 'b', 1, 'c', 2, 'b', 1, 'd'};
    EXPECT_EQ(Rle::compress(data), expected);
    data = "ccc++hhhemmi";
    expected = {3, 'c', 2, '+', 3, 'h', 1, 'e', 2, 'm', 1, 'i'};
    EXPECT_EQ(Rle::compress(data), expected);
}

TEST(NumbersTest, NumberStrings) {
    std::string data = "33312266010";
    std::string expected = {3,'3',1,'1',2,'2',2,'6',1,'0',1,'1',1,'0'};
    EXPECT_EQ(Rle::compress(data), expected);
    data = "--552222289000/";
    expected = {2,'-',2,'5',5,'2',1,'8',1,'9',3,'0',1, '/'};
    EXPECT_EQ(Rle::compress(data), expected);
}

TEST(EmptyStrTest, EmptyStrings) {
    std::string data = "";
    std::string expected = "";
    EXPECT_EQ(Rle::compress(data), expected);
}

TEST(LengthTest, LongStrings) {
    std::string data = "aabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccc";
    std::string expected = {2, 'a', 255, 'b', 3, 'c'};
    EXPECT_EQ(Rle::compress(data), expected);
    data = "22666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666644444";
    expected = {2, '2', 255, '6', 1, '6', 5, '4'};
    EXPECT_EQ(Rle::compress(data), expected);
    data = "22                                                                                                                                                                                                                                                                                                            33444";
    expected = {2, '2', 255, ' ', 45, ' ', 2, '3', 3, '4'};
    EXPECT_EQ(Rle::compress(data), expected);
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}