#ifndef POOLTHREADMANAGER_H
#define POOLTHREADMANAGER_H
#include "IThreadManager.h"
#include <thread>
#include <functional>
#include <vector>
class PoolThreadManager : public IThreadManager {
private:
    std::thread* poolThreads;
    std::function<void()>* functions;
    size_t poolSize;
public:
    PoolThreadManager() = default;
    ~PoolThreadManager() override = default;         // ok to default
    int runThread(std::function<void()> func) override;
    int joinThread(size_t id) override;
    void joinAll() override;
};
#endif
