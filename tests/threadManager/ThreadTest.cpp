#include <gtest/gtest.h>
#include <atomic>
#include <chrono>
#include <functional>
#include <thread>

#include "../../src/Threads.h"

TEST(sianty, thread_run_join) {
    auto func = []() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    };

    Threads threadManager;

    int threadId = threadManager.runThread(func);
    EXPECT_GE(threadId, 0);

    int joinResult = threadManager.joinThread(threadId);
    EXPECT_EQ(joinResult, 0);
}

TEST(sianty, JoinAllWaitsForAllThreads) {
    std::atomic<int> counter{0};

    auto func = [&counter]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        counter++;
    };

    Threads threadManager;

    int lastId = -1;

    // Launch several threads
    for (int i = 0; i < 5; i++) {
        lastId = threadManager.runThread(func);
        EXPECT_GE(lastId, 0);
    }

    threadManager.joinAll();

    // All 5 threads should have finished
    EXPECT_EQ(counter.load(), 5);

    // Joining an already joined thread should fail
    int res = threadManager.joinThread(lastId);
    EXPECT_EQ(res, -1);
}

TEST(joinwise, joinwise) {
    auto func = []() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    };

    Threads threadManager;

    int threadId = threadManager.runThread(func);
    EXPECT_GE(threadId, 0);

    int joinResult = threadManager.joinThread(threadId);
    EXPECT_EQ(joinResult, 0);

    // Second join on same id should fail
    joinResult = threadManager.joinThread(threadId);
    EXPECT_EQ(joinResult, -1);
}

TEST(NOID, noid) {
    auto func = []() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    };

    Threads threadManager;

    // Joining an id that was never created should fail
    int joinResult = threadManager.joinThread(999);
    EXPECT_EQ(joinResult, -1);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
