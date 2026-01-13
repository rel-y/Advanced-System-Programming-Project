#include <gtest/gtest.h>
#include "../../src/CommandLineMenu.h"

TEST(SaintyMenuTest, EmptyCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "");
    EXPECT_EQ(commandResult.second, "");
    delete menu;
}

TEST(SaintyMenuTest, AddCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "add file1 hello world";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "add");
    EXPECT_EQ(commandResult.second, "file1 hello world");
    delete menu;
}

TEST(SaintyMenuTest, GetCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "get file1";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "get");
    EXPECT_EQ(commandResult.second, "file1");
    delete menu;
}

TEST(SaintyMenuTest, SearchCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "search world";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "search");
    EXPECT_EQ(commandResult.second, "world");
    delete menu;
}

TEST(SaintyMenuTest, SpaceSearchCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "search  ";
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "search");
    EXPECT_EQ(commandResult.second, " ");
    delete menu;
}

TEST(SaintyMenuTest, EmptyAddFileCommand) {
    IMenu* menu = new CommandLineMenu();
    std::string command = "add file "; 
    //creating a stream for the input
    std::istringstream inputString(command);
    //saving the cin stream
    auto savecin = std::cin.rdbuf();

    //changing cin stream to be inputString
    std::cin.rdbuf(inputString.rdbuf());

    std::pair<std::string, std::string> commandResult = menu->nextCommand();
    //restoring stdin stream
    std::cin.rdbuf(savecin);
    EXPECT_EQ(commandResult.first, "add");
    EXPECT_EQ(commandResult.second, "file ");
    delete menu;
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}