#include <gtest/gtest.h>
#include "../../src/Threads.h"

TEST(SanityTest, Create1Delete1) {
    Threads threadManager;
    std::thread t = threadManager.CrateThread();
    EXPECT_TRUE(t.joinable());

    int deleteResult = threadManager.deleteThread(std::move(t));
    EXPECT_EQ(deleteResult, 0);
}

TEST(BadDeleteTest, DeleteNotJoinable) {
    Threads threadManager;
    std::thread t = threadManager.CrateThread();
    t.join(); // make it non-joinable

    int result = threadManager.deleteThread(std::move(t));
    EXPECT_EQ(result, -1);
}

TEST(BadDeleteTest2, DeleteOnMovedFromThreadFails) {
    Threads threadManager;
    std::thread t = threadManager.CrateThread();

    int result1 = threadManager.deleteThread(std::move(t));
    EXPECT_EQ(result1, 0);

    // t is now moved-from (empty)
    int result2 = threadManager.deleteThread(std::move(t));
    EXPECT_EQ(result2, -1);
}

TEST(BadDeleteTest3, DeleteThreadNotCreatedByManager) {
    Threads threadManager;

    // Thread not created by any manager
    std::thread t([]() {
        // Do nothing
    });

    int result = threadManager.deleteThread(std::move(t));
    EXPECT_EQ(result, -1);

    // Thread created by another manager
    Threads threadManager2;
    std::thread t2 = threadManager2.CrateThread();

    int result2 = threadManager.deleteThread(std::move(t2));
    EXPECT_EQ(result2, -1);
}

TEST(MultipleThreadsTest, CreateAndDeleteMultiple) {
    Threads threadManager;
    const int numThreads = 10;
    std::thread threads[numThreads];

    for (int i = 0; i < numThreads; ++i) {
        threads[i] = threadManager.CrateThread();
        
    }
    for(int i = 0; i < numThreads; ++i) {
        EXPECT_TRUE(threads[i].joinable());
    }

    for (int i = 0; i < numThreads; ++i) {
        int result = threadManager.deleteThread(std::move(threads[i]));
        EXPECT_EQ(result, 0);
    }
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
