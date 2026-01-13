#include "PoolThreadManager.h"
PoolThreadManager::PoolThreadManager(){
    tasksQueue = std::queue<std::function<void()>>();
    const char* env = std::getenv("POOL_SIZE");

    if (!env) {
        throw std::runtime_error("POOL_SIZE environment variable not set");
    }

    poolSize = std::stoi(env);

    if (poolSize <= 0) {
        throw std::runtime_error("POOL_SIZE must be positive");
    }
    poolThreads = new std::thread[poolSize];
    for (size_t i = 0; i < poolSize; i++) {
        poolThreads[i] = std::thread(&PoolThreadManager::run, this);
    }
}
int PoolThreadManager::runThread(std::function<void()> func) {
    int idlocal;
    {
        if(stop.load()) {
            throw std::runtime_error("ThreadPool has been stopped, cannot run new tasks.");
        }
        std::lock_guard<std::mutex> lock(queueMutex);
        tasksQueue.push(func);
    }
    cv.notify_one();
    return 0;
}

int PoolThreadManager::joinThread(size_t id) {
    return -1;
}
void PoolThreadManager::joinAll() {
    stop.store(true);
    cv.notify_all();
    for(size_t i = 0; i < poolSize; i++) {
        if(poolThreads[i].joinable()) {
            poolThreads[i].join();
        }
    }
}
void PoolThreadManager::run() {
    while (true) {
        std::function<void()> task;
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            cv.wait(lock, [this]() { return !tasksQueue.empty() || stop; });

            if (stop.load() && tasksQueue.empty())
                return;

            task = tasksQueue.front();
            tasksQueue.pop();
        }
        task();
    }
}
PoolThreadManager::~PoolThreadManager() {
    joinAll();
    delete[] poolThreads;
}