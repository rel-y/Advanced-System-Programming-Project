#include "Delete.h"
std::pair<int, std::string> Delete::execute(std::string name){
    //checking the name of the file isn't empty and doens't contain any spaces
    if(name.empty()){
        return {400, ""};
    }
    if(name.find_first_of(' ') != std::string::npos){
        return {400, ""};
    }
    //name of the file
    std::filesystem::path dirName(getenv("FolderName"));
    std::filesystem::path pathName = dirName / name;
    
    std::error_code ec;
    bool exists = std::filesystem::exists(pathName, ec);
    if (ec){ //an error occurred
        return {500, ""}; 
    }else if(!exists){ //the file doesn't exists
        return {404, ""};
    }
    bool is_regular = std::filesystem::is_regular_file(pathName, ec);
    if(ec){
        return {502, ""};
    }else if(is_regular){
        //the file is regular file
        return deleteRegFile(pathName);
    }
    bool is_dir = std::filesystem::is_directory(pathName, ec);
    if(ec){
        return {502, ""};
    }else if(is_regular){
        //the file is directory file
        return deleteDir(pathName);
    }
    return deleteNotDirOrRegFile(pathName);
}

std::pair<int, std::string> Delete::deleteRegFile(std::filesystem::path name){
    //the given file is a regular file
    std::error_code ec;
    bool removed = std::filesystem::remove(name);
    if(ec){ //an error occurred
        return {500, ""};
    }
    //the file was deleted
    return {204 , ""};
}
std::pair<int, std::string> Delete::deleteDir(std::filesystem::path name){
    //we don't support directories yet
    return {404, ""};
}
std::pair<int, std::string> Delete::deleteNotDirOrRegFile(std::filesystem::path name){
    //not supported
    return {404, ""};
}