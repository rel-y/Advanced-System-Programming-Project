#ifndef THREADS_H
#define THREADS_H
#include "IThreadManager.h"
#include <thread>
#include <functional>
class Threads : public IThreadManager {
public:
    Threads() = default;
    ~Threads() override = default;         // ok to default
    int runThread(std::function<void()> func) override;
    int joinThread(size_t id) override;
    void joinAll() override;
};
#endif
