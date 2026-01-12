#include "App.h"
#include "Get.h"
#include "Add.h"
#include "IMenu.h"
#include "ICommand.h"
#include "Search.h"
#include "CommandLineMenu.h"
#include <map>
#include <string>
int main(){
    //creating the map
    std::map<std::string, ICommand*> commands;
    
    ICommand* addCommand = new Add();
    commands["add"] = addCommand;
    
    ICommand* getCommand = new Get();
    commands["get"] = getCommand;

    ICommand* searchCommand = new Search();
    commands["search"] = searchCommand;
    
    IMenu* menu = new CommandLineMenu();

    App app(menu, commands);
    app.run();

    //delete command and menu objects
    delete addCommand;
    delete getCommand;
    delete searchCommand;
    delete menu;
}