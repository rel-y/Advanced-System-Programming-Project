#include "Get.h"
std::string Get::get(std::string name){
    //name of the file
    std::filesystem::path dirName(getenv("FolderName"));
    std::filesystem::path pathName = dirName / name;
    
    if(std::filesystem::exists(pathName) == false){
        //the file doesn't exists
        return "";
    }else if(!(std::filesystem::is_regular_file(pathName))){
        //the file isn't a regular file.
        return "";
    }   
    std::string content;
    try{
        std::ifstream fileStream(pathName);
        if (!fileStream.is_open()) //verifying the stream opened correctly
            return "";
        std::string line;
        while(std::getline(fileStream, line)){ // reading the file line by line
            std::string decompressedContent = Rle::decompress(line);
            content = content + decompressedContent;
        }
        fileStream.close();
    }catch(...){
        return "";
        //there is an error we ignore the command
    }
    return content;
}

void Get::execute(std::string argv){
    //checking the name of the file isn't empty and doens't contain any spaces
    if(argv.empty()){
        return;
    }
    if(argv.find_first_not_of(' ') == std::string::npos){
        return;
    }
    std::string content = get(argv);
    if(!content.empty()){
        std::cout << content << std::endl;
    }
}
