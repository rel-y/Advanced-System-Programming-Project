#include <string>
class ICommand {
public:
    virtual void execute(std::string argv) = 0;
};