const net = require('net');

const portNum = process.env.PORT; //the port of the file server should be passed as an enviroment variable
const serverIp = process.env.SERVERIP;
//creating a connection to the file server
const socket = net.createConnection({host: serverIp, port : portNum});
//sending data to file server
function sendTO(dataToSend){
    //creating the string to send
    let output = '';
    for(let char of dataToSend){
        if(char == '\n' || char == '\\'){//adding a backslash before '\n' or '\\'
            output += '\\';
        }
        output += char;
    }
    socket.write(output + '\n'); //ending the string passed with '\n'
}
let receivedData = ''; //a buffer for the data we will recive through the tcp socket
socket.on('data', chunk => {
    receivedData += chunk.toString();
});
function receiveFrom(){
    return new Promise(resolve =>{
        function processMessage(){
            let i = receivedData.indexOf('\n');
            while(i !== -1){
                if(i > 0 && receivedData.charAt(i-1) === '\\'){
                    i = receivedData.indexOf('\n', i+1);
                    continue;
                }
                //we found an end of a message
                let line = '';
                for(let j = 0; j < i; j++){
                    if(receivedData.charAt(j) === '\\' && (receivedData.charAt(j+1) === '\n' || receivedData.charAt(j+1) == '\\')){
                        j++; //skipping the first '\\' 
                    }
                    line += receivedData.charAt(j);
                }
                receivedData = receivedData.substring(i+1); //removing the message
                resolve(line);//returning the message
                return;
            }
            //we didn't reach the end of the message returning to the event loop so the event listener can get more data
            socket.once('data', processMessage);
        }
        processMessage();

    })
}

function createFile(name, content){
    let command = 'POST' + ' ' + name + ' ' + content;
    sendTO(command);
    return receiveFrom();
}
function getFile(name){
    let command = 'GET' + ' ' + name;
    sendTO(command);
    return receiveFrom();
}
function deleteFile(name){
    let command = 'DELETE' + ' ' + name;
    sendTO(command);
    let output = receiveFrom();
}

function searchFiles(content){
    let command = 'SEARCH' + ' ' + content;
    sendTO(command);
    return receiveFrom();
}
async function patchFile(name, content){
    let output = await deleteFile(name);
    const code = parseInt(output.slice(0, 3), 10);
    if(code !== 204){
        return output; //the delete failed
    }
    return createFile(name, content);
}
// Export the functions to interact with the data
module.exports = {
    createFile,
    getFile,
    deleteFile,
    searchFiles,
    patchFile
};

