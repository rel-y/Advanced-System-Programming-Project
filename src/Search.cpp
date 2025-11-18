#include "Search.h"

namespace fs = std::filesystem;

std::string Search::search(std::string content) {
    if(content.empty()) {
        return "";
    }
    std::string path = getenv("FolderName");
    std::cout << path << std::endl;
    std::string result = "";
    try{
        for (const auto& entry : fs::directory_iterator(path)) {//go over files in the directory
            // Check if the entry is a regular file
            if (fs::is_regular_file(entry.status())) {//if it's a regular file
                std::ifstream inputFile(entry.path());
                if (!inputFile.is_open()) //check if opened successfully
                    return ""; 
                std::string line;
                std::getline(inputFile, line);
                inputFile.close();//we know the content is 1 line
                std::string decompressedContent = Rle::decompress(line);//decompress the content to compare it with the query
                if(decompressedContent.find(content) != std::string::npos) {
                    result += entry.path().filename().string() + "\n";//if found add the file name to the result
                }
            }
        }
    } catch (...) {
        return "";
    }
    result.pop_back(); //remove the last new line
    return result;
}