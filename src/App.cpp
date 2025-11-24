#include "App.h"
App::App(IMenu* menu, std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {}
void App::run(){
    while(true){
        std::pair<std::string, std::string> task = menu->nextCommand();
        try{
            auto command = commands.find(task.first);
            if(!(command == commands.end() || command->second == nullptr)){ //checking the commandexists so we don't get a segfault
                commands[task.first]->execute(task.second);
            }
        }
        catch(...){//catching all exeptions
            //ignoring the command.
        }
    }
}