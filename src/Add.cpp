#include "Add.h"

void Add::execute(std::string argv) {
    std::string fileName = argv.substr(0, argv.find(" "));
    if (fileName.compare(argv)) // no spaces
    {
        return;
    }
    
    std::string text = argv.substr(argv.find(" ") + 1, argv.length() - (argv.find(" ") + 1));
    
    if (text.length() == 0)
    {
        return;
    }
    
    std::string dirName = getenv("FolderName");
    std::string path = dirName.append("/");
    path = path.append(fileName);
    
    std::ofstream ofs(path); // creates file
    ofs << Rle::compress(text);

    ofs.close();
}