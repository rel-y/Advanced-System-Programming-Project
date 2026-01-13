#include "Threads.h"

int Threads::runThread(std::function<void()> func) {
    threads.emplace(nextId++, std::thread(std::move(func)));//crated thread and store it in the map
    return static_cast<int>(nextId - 1);
}
int Threads::joinThread(size_t id){
    auto thread = threads.find(id);
    if(thread == threads.end() || !thread->second.joinable()){
        return -1;
    }
    thread->second.join();//await thread completion if joinable

    return 0;
}
void Threads::joinAll(){
    std::vector<std::size_t> ids;
    ids.reserve(threads.size());

    for (auto& [id, thread] : threads) {
        if (thread.joinable())//joinall threads and store their ids to erase them later
            thread.join();
        ids.push_back(id);
    }

    for (auto id : ids)
        threads.erase(id);
}


