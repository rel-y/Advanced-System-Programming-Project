#ifndef Threads_H
#define Threads_H
#include "IThreadManager.h"
#include <thread>
class Threads : public IThreadManager {
public:
    std::thread CrateThread() override;
public:    int deleteThread(std::thread t) override;
};
#endif