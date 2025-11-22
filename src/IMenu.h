#include <vector>
#include <string>
class IMenu {
public:
    virtual std::vector<std::string> nextCommand() = 0;
};