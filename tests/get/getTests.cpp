#include <gtest/gtest.h>
#include "../../src/Get.h"
#include <fstream>
#include <iostream>
#include <filesystem>
TEST(GetSanityTests, EmptyFileContent) {
    std::string file = "file.txt"; //file name received from user 
    std::string filename = "/usr/src/files/file.txt"; //name
    std::ofstream outfile(filename);
    outfile.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename); //deliting file after using it
    EXPECT_EQ(resualt, "");
}
TEST(GetSanityTests, ShortFileContent) {
    std::string file = "file.txte";
    std::string filename = "/usr/src/files/file.txt"; 
    std::string fileContent = {1,'a'};
    std::ofstream outfile(filename);
    outfile << fileContent;
    outfile.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename); 
    EXPECT_EQ(resualt, "a");
}
TEST(GetSanityTests, LongFileContent) {
    std::string file = "file.txt";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'h', 1,'e', 2,'l', 1,'o', 1,' ', 1,'w', 1,'o', 1,'r', 1, 'l', 1,'d'};  // hello world
    std::ofstream outfile(filename);
    outfile << fileContent;
    outfile.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename);
    EXPECT_EQ(resualt, "hello world");
}
TEST(GetSanityTests, MultipleFiles) {
    std::string file = "file1.txt";
    std::string filename1 = "/usr/src/files/file1.txt";
    std::string filename2 = "/usr/src/files/file2.txt";
    std::string filename3 = "/usr/src/files/file3.txt";
    std::string file1Content = {1,'a', 1,'b', 1,'c'};
    std::string file2Content = {1,'d', 1,'e', 1,'f'};
    std::string file3Content = {1,'g', 1,'h', 1,'i'};
    std::ofstream outfile1(filename1);
    outfile1 << file1Content;
    outfile1.close();
    std::ofstream outfile2(filename2);
    outfile2 << file2Content;
    outfile2.close();
    std::ofstream outfile3(filename3);
    outfile3 << file3Content;
    outfile3.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename1);
    std::filesystem::remove(filename2);
    std::filesystem::remove(filename3);
    EXPECT_EQ(resualt, "abc");
}
TEST(EdgeCaseTests, MultipleWordName) {
    std::string file = "file name";
    std::string filename1 = "/usr/src/files/file.txt";
    std::string filename2 = "/usr/src/files/name.txt";
    std::string fileContent1 = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::string fileContent2 = {1,'n', 1,'a', 1,'m', 1,'e'};
    std::ofstream outfile(filename1);
    outfile << fileContent1; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent2;
    outfile.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename1);
    std::filesystem::remove(filename2);
    EXPECT_EQ(resualt, "");
}
TEST(EdgeCaseTests, EmptyFileName) {
    std::string file = "";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::ofstream outfile(filename);
    outfile << fileContent; 
    outfile.close();
    std::string resualt = Get::get(file);
    std::filesystem::remove(filename);
    EXPECT_EQ(resualt, "");
}
TEST(EdgeCaseTests, FileDoesntExists) {
    std::string file = "file";
    std::string resualt = Get::get(file);
    EXPECT_EQ(resualt, "");
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}