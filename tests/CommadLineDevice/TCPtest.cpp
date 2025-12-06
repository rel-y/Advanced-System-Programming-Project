#include <gtest/gtest.h>
#include "../../src/CommandLineDevice.h"
#include <sstream>

TEST(CommandLineDeviceTest, SendAndReceive) {
    CommandLineDevice device;

    // ---- redirect cin ----
    std::istringstream fakeInput(std::string(10000, 'a') + "\nTest message\n");
    auto* oldCin = std::cin.rdbuf(fakeInput.rdbuf());

    std::string received = device.getInput();
    EXPECT_EQ(received, std::string(10000, 'a'));

    received = device.getInput();
    EXPECT_EQ(received, "Test message");

    std::cin.rdbuf(oldCin); // restore cin
}

TEST(CommandLineDeviceTest, SendOutput) {
    CommandLineDevice device;

    // ---- redirect cout ----
    std::ostringstream fakeOut;
    auto* oldCout = std::cout.rdbuf(fakeOut.rdbuf());

    device.sendOutput("Hello world");

    std::cout.rdbuf(oldCout); // restore cout

    EXPECT_EQ(fakeOut.str(), "Hello world");
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}