#include <gtest/gtest.h>
#include "../../src/CommandLineMenu.h"

TEST(SaintyMenuTest, EmptyCommand) {
    Imenu CLIMenu;
    std::string command = "";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "");
    EXPECT_EQ(commandResult.at(1), "");
}

TEST(SaintyMenuTest, AddCommand) {
    Imenu CLIMenu;
    std::string command = "add file1 hello world";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "add");
    EXPECT_EQ(commandResult.at(1), "file1 hello world");
}

TEST(SaintyMenuTest, GetCommand) {
    Imenu CLIMenu;
    std::string command = "get file1"
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "get");
    EXPECT_EQ(commandResult.at(1), "file1");
}

TEST(SaintyMenuTest, SearchCommand) {
    Imenu CLIMenu;
    std::string command = "search world"
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "search");
    EXPECT_EQ(commandResult.at(1), "world");
}

TEST(SaintyMenuTest, SpaceSearchCommand) {
    Imenu CLIMenu;
    std::string command = "search  "
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "search");
    EXPECT_EQ(commandResult.at(1), " ");
}

TEST(SaintyMenuTest, EmptyAddFileCommand) {
    Imenu CLIMenu;
    std::string command = "add file "
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = cin.rebug();

    //changing cin stream to be inputString
    cin.rebuf(inputString.rebuf());

    std:vector<string> commandResult = CLIMenu.nextCommand();
    //restoring stdin stream
    cin.rebuf(savecin);
    EXPECT_EQ(commandResult.at(0), "add");
    EXPECT_EQ(commandResult.at(1), "file ");
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}