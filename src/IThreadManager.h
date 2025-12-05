#ifndef ITHREADMANAGER_H
#define ITHREADMANAGER_H
#include <thread>
#include <string>
#include <functional>
class IThreadManager {
public:
    virtual ~IThreadManager() = default;
    virtual int runThread(std::function<void()> func) = 0;
    virtual int joinThread(size_t id) = 0;
    virtual void joinAll() =0;

};

#endif
