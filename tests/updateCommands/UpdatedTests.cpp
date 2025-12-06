#include <gtest/gtest.h>
#include "../../src/Search.h"
#include "../../src/Get.h"
#include "../../src/Add.h"
#include "../../src/Rle.h"

TEST(AddTests, BasicInputs) {
    std::string content = "iloveHemi";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfileSanity.txt";
    Add addObject;
    std::pair<int, std::string> result = addObject.execute("testfileSanity.txt iloveHemi");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);
    EXPECT_EQ(result.first, 201);
    EXPECT_EQ(result.second, "");
    fileReader.close();
    std::filesystem::remove(filename);
}

TEST(AddTests, WhiteSpaceInputs) {
    std::string content = "i love Hemi";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfileWhite.txt";
    Add addObject;
    std::pair<int, std::string> result = addObject.execute("testfileWhite.txt i love Hemi");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(result.first, 201);
    EXPECT_EQ(result.second, "");
    EXPECT_EQ(textInFile, compressedContent);
    fileReader.close();
    std::filesystem::remove(filename);
}

TEST(AddTests, OnlyWhiteSpaceInputs) {
    std::string content = " ";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfileOnlyWhite.txt";
    Add addObject1;
    std::pair<int, std::string> result1 = addObject1.execute("testfileOnlyWhite.txt  ");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);
    EXPECT_EQ(result1.first, 201);
    EXPECT_EQ(result1.second, "");
    fileReader.close();
    std::filesystem::remove(filename);

    std::string content2 = "        ";
    std::string compressedContent2 = Rle::compress(content2);
    std::string filename2 = "/usr/src/files/testfileReallyWhite.txt";
    Add addObject2;
    std::pair<int, std::string> result2 = addObject2.execute("testfileReallyWhite.txt         ");
    
    std::string textInFile2 = "";
    std::ifstream fileReader2(filename2);
    ASSERT_TRUE(fileReader2.good());
    getline(fileReader2, textInFile2);
    EXPECT_EQ(textInFile2, compressedContent2);
    EXPECT_EQ(result2.first, 201);
    EXPECT_EQ(result2.second, "");
    fileReader2.close();
    std::filesystem::remove(filename2);
}

TEST(AddTests, NubersInputs) {
    std::string content = "123  44+-/5a5 ";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfileNums.txt";
    Add addObject1;
    std::pair<int, std::string> result1 = addObject1.execute("testfileNums.txt 123  44+-/5a5 ");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);
    EXPECT_EQ(result1.first, 201);
    EXPECT_EQ(result1.second, "");
    fileReader.close();
    std::filesystem::remove(filename);
}

TEST(AddTests, LongInput) {
    std::string content = "rqegiho AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA eugfy";
    std::string compressedContent = Rle::compress(content);
    std::string filename = "/usr/src/files/testfileLong.txt";
    Add addObject;
    std::pair<int, std::string> result = addObject.execute("testfileLong.txt rqegiho AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA eugfy");
    
    std::string textInFile = "";
    std::ifstream fileReader(filename);
    ASSERT_TRUE(fileReader.good());
    getline(fileReader, textInFile);
    EXPECT_EQ(textInFile, compressedContent);
    EXPECT_EQ(result.first, 201);
    EXPECT_EQ(result.second, "");
    fileReader.close();
    std::filesystem::remove(filename);
}

TEST(AddTests, BadInputs) {
    
    std::string filename1 = "/usr/src/files/testfile1.txt";
    Add addObject1;
    std::pair<int, std::string> result1 = addObject1.execute("testfile1.txt");
    
    std::ifstream fileReader1(filename1);
    ASSERT_TRUE(fileReader1.good());
    EXPECT_EQ(result1.first, 201);
    EXPECT_EQ(result1.second, "");
    fileReader1.close();
    std::filesystem::remove(filename1);


    std::string filename2 = "/usr/src/files/testfile2.txt";
    Add addObject2;
    std::pair<int, std::string> result2 = addObject2.execute("testfile2.txt ");
    
    std::ifstream fileReader2(filename2);
    ASSERT_TRUE(fileReader2.good());
    EXPECT_EQ(result2.first, 201);
    EXPECT_EQ(result2.second, "");
    fileReader2.close();
    std::filesystem::remove(filename2);

    
    std::string filename3 = "/usr/src/files/testfile3.txt";
    std::ofstream outfile(filename3);
    std::string fileContent3 = {1,'h', 1,'e', 2,'l', 1,'o', 1,' ', 1,'w', 1,'o', 1,'r', 1, 'l', 1,'d'};  // hello world
    std::ofstream outfile3(filename3);
    outfile3 << fileContent3;
    outfile3.close(); //closing stream
    
    Add addObject3;
    std::pair<int, std::string> result3 = addObject3.execute("testfile3.txt hi");
    std::string textInFile = "";
    std::ifstream fileReader3(filename3);
    getline(fileReader3, textInFile);
    EXPECT_EQ(textInFile, fileContent3); //checking that add didn't change the file
    EXPECT_EQ(result3.first, 404); //trying to create a file that already exists
    EXPECT_EQ(result3.second, "");
    fileReader3.close();
    std::filesystem::remove(filename3);

}


TEST(GetTests, EmptyFileContent) {
    std::string file = "file.txt"; //file name received from user 
    std::string filename = "/usr/src/files/file.txt"; //name
    std::ofstream outfile(filename); //stream to file
    outfile.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename); //deleting file after using it
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "");
}
TEST(GetTests, ShortFileContent) {
    std::string file = "file.txt";
    std::string filename = "/usr/src/files/file.txt"; 
    std::string fileContent = {1,'a'};
    std::ofstream outfile(filename); //stream to file
    outfile << fileContent;
    outfile.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename); //deleting file after using it
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "a");
}
TEST(GetTests, LongFileContent) {
    std::string file = "file.txt";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'h', 1,'e', 2,'l', 1,'o', 1,' ', 1,'w', 1,'o', 1,'r', 1, 'l', 1,'d'};  // hello world
    std::ofstream outfile(filename);
    outfile << fileContent;
    outfile.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename);
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "hello world");
}
TEST(GetTests, MultipleFiles) {
    std::string file = "file1.txt";
    std::string filename1 = "/usr/src/files/file1.txt";
    std::string filename2 = "/usr/src/files/file2.txt";
    std::string filename3 = "/usr/src/files/file3.txt";
    std::string file1Content = {1,'a', 1,'b', 1,'c'};
    std::string file2Content = {1,'d', 1,'e', 1,'f'};
    std::string file3Content = {1,'g', 1,'h', 1,'i'};
    std::ofstream outfile1(filename1); //stream to file1
    outfile1 << file1Content;
    outfile1.close(); //closing stream
    std::ofstream outfile2(filename2); //stream to file2
    outfile2 << file2Content;
    outfile2.close(); //closing stream
    std::ofstream outfile3(filename3); //stream to file3
    outfile3 << file3Content;
    outfile3.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename1);
    std::filesystem::remove(filename2);
    std::filesystem::remove(filename3);
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "abc");
}
TEST(GetTests, MultipleWordName) {
    std::string file = "file.txt name.txt";
    std::string filename1 = "/usr/src/files/file.txt";
    std::string filename2 = "/usr/src/files/name.txt";
    std::string fileContent1 = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::string fileContent2 = {1,'n', 1,'a', 1,'m', 1,'e'};
    std::ofstream outfile1(filename1); //stream to file1
    outfile1 << fileContent1; 
    outfile1.close(); //closing stream
    std::ofstream outfile2(filename2); //stream to file2
    outfile2 << fileContent2;
    outfile2.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename1);
    std::filesystem::remove(filename2);
    EXPECT_EQ(result.first, 400); //bad request 
    EXPECT_EQ(result.second, "");
}
TEST(GetTests, EmptyFileName) {
    std::string file = "";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::ofstream outfile(filename); //stream to file
    outfile << fileContent; 
    outfile.close(); //closing stream
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    std::filesystem::remove(filename);
    EXPECT_EQ(result.first, 400); //bad request 
    EXPECT_EQ(result.second, "");
}
TEST(GetTests, FileDoesntExists) {
    std::string file = "file";
    Get getObject;
    std::pair<int, std::string> result = getObject.execute(file);
    EXPECT_EQ(result.first, 404);
    EXPECT_EQ(result.second, "");
}


TEST(SearchTests, BasicSearch) {
    std::string content = "search1";//content from user
    std::string filename = "/usr/src/files/testfile.txt"; //name
    std::string fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h',1,'1'}; //compressed content
    std::ofstream outfile(filename);
    outfile << fileContent; //input compressed content to file
    outfile.close();
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "testfile.txt");
    content = "search";
    filename = "/usr/src/files/testfile.txt";
    fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h',1,'1',1,'d', 1,'x'}; //not exact match
    outfile.open(filename);
    outfile << fileContent;
    outfile.close();
    result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "testfile.txt");
}

TEST(SearchTests, SearchNoMatch) {
    std::string content = "nomatch";
    std::string filename1 = "/usr/src/files/file1.txt";
    std::string filename2 = "/usr/src/files/file2.txt";
    std::string fileContent = {1,'s', 1,'e', 1,'a', 1,'r', 1,'c', 1,'h'}; 
    std::ofstream outfile(filename1);
    outfile << fileContent; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent;
    outfile.close();
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename1); //make sure file is removed after test
    std::filesystem::remove(filename2); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "");
}
TEST(SearchTests, SearchOfAnEmptyFile) {
    std::string content = "anything";
    std::string filename = "/usr/src/files/emptyfile.txt";
    std::ofstream outfile(filename);
    outfile.close(); 
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "");
}
TEST(SearchTests, SearchOfEmptyContent) {
    std::string content = "";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'a', 1,'b', 1,'c'};
    std::ofstream outfile(filename);
    outfile << fileContent;
    outfile.close(); 
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 400);
    EXPECT_EQ(result.second, "");
}
TEST(SearchTests, SearchMultipleFiles) {
    std::string content = "match";
    std::string filename1 = "/usr/src/files/file1.txt";
    std::string filename2 = "/usr/src/files/file2.txt";
    std::string fileContent1 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h'};
    std::string fileContent2 = {1,'m', 1,'a', 1,'t', 1,'c', 1,'h',1,'d', 1,'x'};
    std::ofstream outfile(filename1);
    outfile << fileContent1; 
    outfile.close();
    outfile.open(filename2);
    outfile << fileContent2;
    outfile.close();
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename1); //make sure file is removed after test
    std::filesystem::remove(filename2); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "file1.txt file2.txt");
    
    content = "match";
    filename1 = "/usr/src/files/file1.txt";
    filename2 = "/usr/src/files/file2.txt";
    std::string filename3 = "/usr/src/files/fil3.txt";
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
    result = searchObject.execute(content);
    std::filesystem::remove(filename1); //make sure file is removed after test
    std::filesystem::remove(filename2); //make sure file is removed after test
    std::filesystem::remove(filename3); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "file1.txt file2.txt");
}
TEST(SearchTests, SearchOnFileNames) {
    std::string content = "Search";//content from user
    std::string filename = "/usr/src/files/Search.txt"; //name
    std::string fileContent = {1,'h', 1,'i'}; //compressed content
    std::ofstream outfile(filename);
    outfile << fileContent; //input compressed content to file
    outfile.close();
    Search searchObject;
    std::pair<int, std::string> result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "Search.txt");
    content = "one";
    filename = "/usr/src/files/SomeoneSearchedSomething.txt";
    fileContent = {1,'h', 1, 'e', 1, 'l', 1, 'l', 1, 'o'}; 
    outfile.open(filename);
    outfile << fileContent;
    outfile.close();
    result = searchObject.execute(content);
    std::filesystem::remove(filename); //make sure file is removed after test
    EXPECT_EQ(result.first, 200);
    EXPECT_EQ(result.second, "SomeoneSearchedSomething.txt");
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}