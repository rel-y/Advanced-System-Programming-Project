#ifndef DELETE_H
#define DELETE_H
#include "ICommand.h"
#include <filesystem>
class Delete: public ICommand {
public: 
    std::pair<int, std::string> execute(std::string argv) override;
    virtual std::pair<int, std::string> deleteRegFile(std::filesystem::path name);
    virtual std::pair<int, std::string> deleteDir(std::filesystem::path name);
    virtual std::pair<int, std::string> deleteNotDirOrRegFile(std::filesystem::path name);
};
#endif // DELETE_H