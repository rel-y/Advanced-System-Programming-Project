#include <gtest/gtest.h>
#include <atomic>
#include <chrono>
#include <functional>
#include <thread>

#include "../../src/PoolThreadManager.h"

TEST(thread_pool, runReturnsValidId) {
    PoolThreadManager mgr;

    std::atomic<int> x{0};

    int id = mgr.runThread([&]() { x.store(1, std::memory_order_release); });
    EXPECT_GE(id, 0);

    mgr.joinAll();
    EXPECT_EQ(x.load(std::memory_order_acquire), 1);
}

TEST(thread_pool, joinAllWaitsForAllTasks) {
    PoolThreadManager mgr;

    std::atomic<int> done{0};
    const int N = 200;

    for (int i = 0; i < N; ++i) {
        int id = mgr.runThread([&]() { done.fetch_add(1, std::memory_order_relaxed); });
        ASSERT_GE(id, 0);
    }

    mgr.joinAll();
    EXPECT_EQ(done.load(std::memoryOrderRelaxed), N);
}

TEST(thread_pool, tasks_can_modify_shared_data_safely_when_synchronized) {
    PoolThreadManager mgr;

    // Using atomic so the test is about the pool, not data races in the test.
    std::atomic<long long> sum{0};
    const int N = 1000;

    for (int i = 1; i <= N; ++i) {
        int id = mgr.runThread([&, i]() { sum.fetch_add(i, std::memory_order_relaxed); });
        ASSERT_GE(id, 0);
    }

    mgr.joinAll();

    long long expected = (static_cast<long long>(N) * (N + 1)) / 2;
    EXPECT_EQ(sum.load(std::memory_order_relaxed), expected);
}

TEST(thread_pool, joinAllIsIdempotent) {
    PoolThreadManager mgr;

    std::atomic<int> done{0};
    const int N = 50;

    for (int i = 0; i < N; ++i) {
        int id = mgr.runThread([&]() { done.fetch_add(1, std::memory_order_relaxed); });
        ASSERT_GE(id, 0);
    }

    mgr.joinAll();
    mgr.joinAll(); // should not crash / deadlock / change results
    EXPECT_EQ(done.load(std::memory_order_relaxed), N);
}

// TEST(joinwise, joinwise) { // no join thread implemented
//     auto func = []() {
//         std::this_thread::sleep_for(std::chrono::milliseconds(100));
//     };

//     PoolThreadManager threadManager;

//     int threadId = threadManager.runThread(func);
//     EXPECT_GE(threadId, 0);

//     int joinResult = threadManager.joinThread(threadId);
//     EXPECT_EQ(joinResult, 0);

//     // Second join on same id should fail
//     joinResult = threadManager.joinThread(threadId);
//     EXPECT_EQ(joinResult, -1);
// }

// TEST(NOID, noid) { join thread not implemented
//     auto func = []() {
//         std::this_thread::sleep_for(std::chrono::milliseconds(100));
//     };

//     PoolThreadManager threadManager;

//     // Joining an id that was never created should fail
//     int joinResult = threadManager.joinThread(999);
//     EXPECT_EQ(joinResult, -1);
// }

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
