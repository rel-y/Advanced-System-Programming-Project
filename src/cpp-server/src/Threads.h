#ifndef THREADS_H
#define THREADS_H
#include "IThreadManager.h"
#include <thread>
#include <functional>
#include <vector>
class Threads : public IThreadManager {
private:
    std::unordered_map<std::size_t, std::thread> threads;
    std::size_t nextId = 0;
public:
    Threads() = default;
    ~Threads() override = default;         // ok to default
    int runThread(std::function<void()> func) override;
    int joinThread(size_t id) override;
    void joinAll() override;
};
#endif
