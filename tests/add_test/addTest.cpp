#include <gtest/gtest.h>
#include "../../src/Add.h"

TEST(SanityTest, BasicInputs) {
    std::string content = "iloveHemi";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfile.txt";
    Add addObject;
    addObject.execute("testfile.txt iloveHemi");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);

    fileReader.close();
}

TEST(WhiteSpaceTest, WhiteSpaceInputs) {
    std::string content = "i love Hemi";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfile.txt";
    Add addObject;
    addObject.execute("testfile.txt i love Hemi");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);

    fileReader.close();
}

TEST(OnlyWhiteSpaceTest, OnlyWhiteSpaceInputs) {
    std::string content = " ";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfile.txt";
    Add addObject;
    addObject.execute("testfile.txt  ");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);

    fileReader.close();

    std::string content2 = "        ";
    std::string compressedContent2 = Rle::compress(content2);
    std::string filename2 = "/usr/src/files/testfile2.txt";
    Add addObject2;
    addObject2.execute("testfile2.txt         ");
    
    std::string textInFile2 = "";
    std::ifstream fileReader2(filename2);
    ASSERT_TRUE(fileReader2.good());
    getline(fileReader2, textInFile2);
    EXPECT_EQ(textInFile2, compressedContent2);

    fileReader2.close();
}

TEST(NumbersTest, NubersInputs) {
    std::string content = "123  44+-/5a5 ";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfile.txt";
    Add addObject;
    addObject.execute("testfile.txt 123  44+-/5a5 ");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);

    fileReader.close();
}

TEST(LongTest, LongInput) {
    std::string content = "rqegiho AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA eugfy";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfile.txt";
    Add addObject;
    addObject.execute("testfile.txt rqegiho AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA eugfy");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);

    fileReader.close();
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}