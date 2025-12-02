#include "Threads.h"
std::thread Threads::CrateThread() {
    return std::thread([](){
        // Do nothing
    });//placeholder
}
int Threads::deleteThread(std::thread t) {
    return -1; //placeholder
}