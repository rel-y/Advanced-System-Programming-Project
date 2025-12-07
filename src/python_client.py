import socket
import sys


if __name__ == '__main__':
    args = sys.argv[1:]
    ip = args[1]
    port = args[2]

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # create IPv4 TCP socket
    s.connect((ip, port))

    while True:
        msg = input() # read from user

        s.send(bytes(msg, 'utf-8')) # send to server

        data = s.recv(4096) # recv from server
        recvd_str = data.decode('utf-8')
        final_recvd_str = recvd_str
        while len(recvd_str) == 4096:
            data = s.recv(4096)
            recvd_str = data.decode('utf-8')
            final_recvd_str = final_recvd_str + recvd_str

        print(final_recvd_str) # print to user


