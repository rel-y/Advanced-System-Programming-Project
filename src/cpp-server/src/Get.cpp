#include "Get.h"

std::pair<int, std::string> Get::execute(std::string name){
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
        return {500, ""};
    }else if(!is_regular){
        return {404, ""}; //the file isn't a regular file
    }

    std::string content;
    std::ifstream fileStream(pathName);
    if(!fileStream){
        return {500, ""}; //couldn't open the file
    }

    std::string line;
    while(true){ // reading the file line by line
        if(std::getline(fileStream, line)){
            std::string decompressedContent = Rle::decompress(line);
            content = content + decompressedContent;
        }else if(fileStream.eof()){ //end of file
            break;
        }else{ // i/o error
            return {500, ""};
        }
    }
    fileStream.clear(); //removing failbit that was set on by doing getline on eof
    fileStream.close();
    if(fileStream.fail()){ //failed to close
        return {500, ""};
    }
    //adding \n to end of content
    content += '\n';
    return {200 ,content};
}
