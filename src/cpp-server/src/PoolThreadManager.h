#ifndef POOLTHREADMANAGER_H
#define POOLTHREADMANAGER_H
#include "IThreadManager.h"
#include <thread>
#include <functional>
#include <vector>
#include <cstdlib>
#include <stdexcept>
#include <queue>
#include <tuple>
#include <mutex>
#include <condition_variable>
#include <atomic>
class PoolThreadManager : public IThreadManager {
private:
    std::thread* poolThreads;
    std::queue<std::function<void()>> tasksQueue;
    size_t poolSize;
    std::mutex queueMutex;
    std::condition_variable cv;
    std::atomic<bool> stop = false;
    void run();
public:
    PoolThreadManager();
    ~PoolThreadManager() override;
    int runThread(std::function<void()> func) override;
    int joinThread(size_t id) override;
    void joinAll() override;
};
#endif
