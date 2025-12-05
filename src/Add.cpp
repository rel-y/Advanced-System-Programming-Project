#include "Add.h"

std::pair<int, std::string> Add::execute(std::string argv) {
    std::string fileName = argv.substr(0, argv.find(" "));
    std::filesystem::path dirName(getenv("FolderName"));
    std::filesystem::path path = dirName / fileName;

    std::error_code ec;
    bool exists = std::filesystem::exists(path, ec);
    if (ec){ //an error occurred
        return {500, ""}; 
    }else if(exists){//file exists
        return {404, ""};
    }
    if (argv[0] == ' '){ // space in filename, bad command
        return {400, ""};
    }

    std::ofstream ofs(path); //create file
    if(!ofs){ // failed to open
        return {500, ""};
    }

    if (fileName != argv){
        std::string text = argv.substr(argv.find(" ") + 1, argv.length() - (argv.find(" ") + 1));
        ofs << Rle::compress(text);
    }
    
    ofs.close();
    if(!ofs){ //failed to close
        return {500, ""};
    }
    return {201, ""};
}