#include "Add.h"

void Add::execute(std::string argv) {
    std::string fileName = argv.substr(0, argv.find(" "));
    //std::cout << fileName;
    //std::cout << argv;
    if (fileName == argv) // no spaces
    {
        //std::cout << "h1";
        return;
    }
    
    std::string text = argv.substr(argv.find(" ") + 1, argv.length() - (argv.find(" ") + 1));
    //std::cout << text;
    if (text.length() == 0)
    {
        return;
    }
    
    std::string dirName = getenv("FolderName");
    std::string path = dirName.append("/");
    path = path.append(fileName);
    //std::cout << std::endl << path;
    std::ofstream ofs(path); // creates file
    //std::cout << std::endl << ofs.good() << std::endl;
    //std::cout << ofs.is_open();
    ofs << Rle::compress(text);

    ofs.close();
}