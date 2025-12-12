#include "Search.h"

namespace fs = std::filesystem;
int Search::searchFile(fs::directory_entry file, std::string content){
    fs::path filePath = file.path();
    if(filePath.filename().string().find(content) != std::string::npos){
        return 1; //found content in the name of the file
    }
    std::error_code ec;
    bool is_regular = std::filesystem::is_regular_file(filePath, ec);
    if(ec){
        return -1; //error
    }else if(!is_regular){
        return 0; //the file isn't a regular file so we don't check him
    }
    std::ifstream inputFile(filePath);
    if(!inputFile){
        return -1; //couldn't open the file
    }

    std::string line;
    std::getline(inputFile, line);
    if(!inputFile.eof()){ // i/o error
        return -1;
    }
    inputFile.clear(); //removing failbit that was set on by doing getline on eof
    inputFile.close();//we know the content is 1 line
    if(inputFile.fail()){ //failed to close
        return -1;
    }
    std::string decompressedContent = Rle::decompress(line);//decompress the content to compare it with the query
    if(decompressedContent.find(content) != std::string::npos) {
        return 1; //content is in the file
    }
    return 0;
}
std::pair<int, std::string> Search::execute(std::string content) {
    if(content.empty()) {
        return {400, ""};
    }
    std::string path = getenv("FolderName");
    std::vector<std::string> files;
    std::string result = "";
    for (const auto& entry : fs::directory_iterator(path)) {//go over files in the directory
        int is_in_file = searchFile(entry, content);
        if(is_in_file == -1){ //an i/o error occurred
            return {500, ""};
        }else if(is_in_file == 1){ // the file contains content
            files.push_back(entry.path().filename().string() + " ");//add the file name to the files vector
        }
        
    }
    //order vector files alphabetically and push the resualt to the string
    if(files.empty()) {
        return {200, ""};
    }
    std::sort(files.begin(), files.end());
    for(std::string fileName : files) {
        result += fileName;
    }
    result.pop_back(); //remove the last space
    //adding \n to end of result
    result += '\n';
    return {200, result};
}