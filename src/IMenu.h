#ifndef IMENU_H
#define IMENU_H
#include <utility>
#include <string>
class IMenu {
public:
    virtual std::pair<std::string, std::string> nextCommand() = 0;
};
#endif //IMENU_H