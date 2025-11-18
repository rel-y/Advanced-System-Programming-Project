#include <gtest/gtest.h>
#include "../../src/Search.h"
TEST(SearchFunctionalityTest, BasicSearch) {
    std::string content = "search";//content from user
    std::string filename = "files/testfile.txt"; //name
    std::string fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h'}; //compressed content
    std::ofstream outfile(filename);
    outfile << fileContent; //input compressed content to file
    outfile.close();
    std::string resualt = Search::search(content);

    EXPECT_EQ(resualt, "testfile.txt");
    content = "search";
    filename = "files/testfile.txt";
    fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h',1,'d', 1,'x'}; //not exact match
    outfile.open(filename);
    outfile << fileContent;
    outfile.close();
    resualt = Search::search(content);

    EXPECT_EQ(resualt, "testfile.txt");
}
TEST(NoResualtTest, SearchNoMatch) {
    std::string content = "nomatch";
    std::string filename1 = "files/nomatchfile.txt";
    std::string filename2 = "files/anothernomatchfile.txt";
    std::string fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h'}; 
    std::ofstream outfile(filename1);
    outfile << fileContent; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent;
    outfile.close();
    std::string resualt = Search::search(content);

    EXPECT_EQ(resualt, "No files found");
}
TEST(EmptyFileTest, SearchInEmptyFile) {
    std::string content = "anything";
    std::string filename = "files/emptyfile.txt";
    std::ofstream outfile(filename);
    outfile.close(); 
    std::string resualt = Search::search(content);

    EXPECT_EQ(resualt, "");
}
TEST(EmptyContent, SearchInEmptyContent) {
    std::string content = "";
    std::string filename = "files/file.txt";
    std::string fileContent = {1,'a', 1,'b', 1,'c'};
    std::ofstream outfile(filename);
    outfile << fileContent;
    outfile.close(); 
    std::string resualt = Search::search(content);

    EXPECT_EQ(resualt, "");
}
TEST(MultipleFilesTest, SearchMultipleFiles) {
    std::string content = "match";
    std::string filename1 = "files/matchfile1.txt";
    std::string filename2 = "files/matchfile2.txt";
    std::string fileContent1 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h'};
    std::string fileContent2 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h',1,'d', 1,'x'};
    std::ofstream outfile(filename1);
    outfile << fileContent1; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent2;
    outfile.close();
    std::string resualt = Search::search(content);

    EXPECT_EQ(resualt, "matchfile1.txt\nmatchfile2.txt");

    content = "match";
    filename1 = "files/matchfile1.txt";
    filename2 = "files/matchfile2.txt";
    std::string filename3 = "files/nomatchfile.txt";
    fileContent1 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h'};
    fileContent2 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h',1,'d', 1,'x'};
    std::string fileContent3 = {1,'n',1,'o'};
    outfile.open(filename1);
    outfile << fileContent1; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent2;
    outfile.close();
    outfile.open(filename3);
    outfile << fileContent3;
    outfile.close();
    resualt = Search::search(content);
    EXPECT_EQ(resualt, "matchfile1.txt\nmatchfile2.txt");
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}