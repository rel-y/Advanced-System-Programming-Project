#include "Search.h"

namespace fs = std::filesystem;

std::string Search::search(std::string content) {
    if(content.empty()) {
        return "";
    }
    std::string path = getenv("FolderName");
    std::vector<std::string> files;
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
                    files.push_back(entry.path().filename().string() + "\n");//if found add the file name to the files vector
                }
            }
        }
    } catch (...) {
        return "";
    }
    //order vector files alphabetically and push the resualt to the string
    if(files.empty()) {
        return "";
    }
std::sort(files.begin(), files.end());
    for(const auto& fileName : files) {
        result += fileName;
    }
    result.pop_back(); //remove the last new line
    return result;
}

void Search::execute(std::string argv) {
    std::string resualt = search(argv);
    if(!resualt.empty()) {
        std::cout << resualt << std::endl;
    }
}