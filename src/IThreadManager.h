#ifndef ITHREADMANAGER_H
#define ITHREADMANAGER_H
#include <thread>
class IThreadManager {
public:
    virtual std::thread CrateThread() = 0;
    virtual int deleteThread(std::thread t) = 0;
};
#endif