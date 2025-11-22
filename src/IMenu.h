#include <utility>
#include <string>
class IMenu {
public:
    virtual std::pair<std::string, std::string> nextCommand() = 0;
};