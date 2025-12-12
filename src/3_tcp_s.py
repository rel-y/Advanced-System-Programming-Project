import socket # import lib

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # create IPv4 TCP socket
server_ip = '' # recv from any ip
server_port = 12345 # on port 12345
server.bind((server_ip, server_port)) # bind socket to any ip on port 12345
server.listen(5) # allow a backlog of 5 connections

while True: # forever
    client_socket, client_address = server.accept() # accept clinet from backlog. returns new socket of exclusive connection
    print('Connection from: ', client_address) # print whos the client
    data = client_socket.recv(1024) # recive 1024 bytes
    while not data.decode('utf-8') == '': # continue reciving until client dissconnects and TCP notifies on it
        print('Received: ', data.decode('utf-8')) # print recived (with UTF-8)
        client_socket.send(data.upper()) # send back UPCASED
        data = client_socket.recv(1024) # recive again

    print('Client disconnected') # print that client disconnected
    client_socket.close() # close the private client socket