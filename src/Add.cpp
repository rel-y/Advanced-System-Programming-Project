#include "Add.h"

void Add::execute(std::string argv) {
    std::string fileName = argv.substr(0, argv.find(" "));

    std::string dirName = getenv("FolderName");
    std::string path = dirName.append("/");
    path = path.append(fileName);
    
    if (access(path.c_str(), F_OK) != -1) // file exists
    {
        return;
    }
    
    
    
    if (fileName == argv) // no spaces
    {
        std::string dirName = getenv("FolderName");
        std::string path = dirName.append("/");
        path = path.append(fileName);
        std::ofstream ofs(path);
        ofs.close();
        return;
    }
    
    std::string text = argv.substr(argv.find(" ") + 1, argv.length() - (argv.find(" ") + 1));
    
    std::ofstream ofs(path); // creates file
    
    ofs << Rle::compress(text);

    ofs.close();
}