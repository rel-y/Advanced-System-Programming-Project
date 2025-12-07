#include <gtest/gtest.h>
#include "../../src/Delete.h"
#include <fstream>
#include <iostream>
#include <filesystem>
TEST(DeleteSanityTests, EmptyFileDeletion) {
    std::string file = "file.txt"; //file name received from user 
    std::string filename = "/usr/src/files/file.txt"; //name
    std::ofstream outfile(filename); // opening a new file
    outfile.close(); //closing stream
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file);
    //checking the file was deleted
    bool exists = std::filesystem::exists(filename); 
    EXPECT_FALSE(exists);
    EXPECT_EQ(result.first, 204);
    EXPECT_EQ(result.second, ""); // delete should return an empty string
    if(exists){
        //the delete function failed we need to remove the file anyway
        std::filesystem::remove(filename);
    }
}
TEST(DeleteSanityTests, NotEmptyFileDeletion) {
    std::string file = "file.txt"; //file name received from user 
    std::string filename = "/usr/src/files/file.txt"; //name
    std::string fileContent = {1,'a', 2, 'b', 3, 'c', 4, 'd'};
    std::ofstream outfile(filename); // opening a new file
    outfile << fileContent;
    outfile.close(); //closing stream
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file);
    //checking that the file was deleted
    bool exists = std::filesystem::exists(filename); 
    EXPECT_FALSE(exists);
    EXPECT_EQ(result.first, 204);
    EXPECT_EQ(result.second, ""); // delete should return an empty string
    if(exists){
        //the delete function failed we need to remove the file anyway
        std::filesystem::remove(filename);
    }
}
TEST(DeleteSanityTests, MultipleFilesDeletion) {
    std::string file1 = "file1.txt";
    std::string file2 = "file2.txt";
    std::string filename1 = "/usr/src/files/file1.txt";
    std::string filename2 = "/usr/src/files/file2.txt";
    std::string filename3 = "/usr/src/files/file3.txt";
    std::string file1Content = {1,'a', 2,'b', 3,'c'};
    std::string file2Content = {4,'d', 5,'e', 6,'f'};
    std::string file3Content = {7,'g', 8,'h', 9,'i'};
    std::ofstream outfile1(filename1); //stream to file1
    outfile1 << file1Content;
    outfile1.close(); //closing stream
    std::ofstream outfile2(filename2); //stream to file2
    outfile2 << file2Content;
    outfile2.close(); //closing stream
    std::ofstream outfile3(filename3); //stream to file3
    outfile3 << file3Content;
    outfile3.close(); //closing stream
    Delete deleteObject;
    std::pair<int, std::string> result1 = deleteObject.execute(file1);
    std::pair<int, std::string> result2 = deleteObject.execute(file2);
    //checking that the files were deleted
    bool exists1 = std::filesystem::exists(filename1);
    bool exists2 = std::filesystem::exists(filename2);
    bool exists3 = std::filesystem::exists(filename3);
    EXPECT_FALSE(exists1);
    EXPECT_FALSE(exists2);
    EXPECT_EQ(result1.first, 204);
    EXPECT_EQ(result1.second, "");
    EXPECT_EQ(result2.first, 204);
    EXPECT_EQ(result2.second, "");
    if(exists1){
        //the delete function failed we need to remove the file anyway
        std::filesystem::remove(filename1);
    }
    if(exists2){
        std::filesystem::remove(filename2);
    }
    EXPECT_TRUE(exists3); //checking the third file wasn't deleted
    std::filesystem::remove(filename3);
}
TEST(EdgeCaseTests, MultipleWordFileName) {
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
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file); //execute should fail, parameter isn't valid
    EXPECT_TRUE(std::filesystem::exists(filename1));
    EXPECT_TRUE(std::filesystem::exists(filename2));
    EXPECT_EQ(result.first, 400);
    EXPECT_EQ(result.second, "");
    std::filesystem::remove(filename1);
    std::filesystem::remove(filename2);

}
TEST(EdgeCaseTests, EmptyFileName) {
    std::string file = "";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::ofstream outfile(filename); //stream to file
    outfile << fileContent; 
    outfile.close(); //closing stream
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file); //execute should fail, parameter isn't valid
    EXPECT_TRUE(std::filesystem::exists(filename));
    EXPECT_EQ(result.first, 400);
    EXPECT_EQ(result.second, "");
    std::filesystem::remove(filename);
}
TEST(EdgeCaseTests, FileNameIsSpaces) {
    std::string file = "   ";
    std::string filename = "/usr/src/files/file.txt";
    std::string fileContent = {1,'f', 1,'i', 1,'l', 1,'e'};
    std::ofstream outfile(filename); //stream to file
    outfile << fileContent; 
    outfile.close(); //closing stream
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file); //execute should fail, parameter isn't valid
    EXPECT_TRUE(std::filesystem::exists(filename));
    EXPECT_EQ(result.first, 400);
    EXPECT_EQ(result.second, "");
    std::filesystem::remove(filename);
}
TEST(EdgeCaseTests, FileDoesntExists) {
    std::string file = "file";
    Delete deleteObject;
    std::pair<int, std::string> result = deleteObject.execute(file); //execute should fail, file doesn't exists
    EXPECT_EQ(result.first, 404);
    EXPECT_EQ(result.second, "");
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}