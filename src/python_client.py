import socket
import sys
import string

class TCPDevice:
    def __init__(self, socketID):
        self.socketID = socketID
        self.rest = ""

    def getInput(self):
        while True:
            # Check if we already have a full line in the buffer
            pos = self.rest.find('\n')
            while pos != -1:
                if pos > 0 and self.rest[pos - 1] == '\\':
                    # Escaped newline, continue searching
                    pos = self.rest.find('\n', pos + 1)
                    continue

                # Extract one line (up to '\n', not including)
                line = self.rest[:pos]

                # Remove escape '\' before '\n' or '\'
                i = 0
                while i < len(line):
                    if (
                        line[i] == '\\'
                        and (i + 1 < len(line))
                        and (line[i + 1] == '\n' or line[i + 1] == '\\')
                    ):
                        # Remove the escape backslash
                        line = line[:i] + line[i + 1:]
                    i += 1

                # Remove this line (and the '\n') from buffer
                self.rest = self.rest[pos + 1:]
                return line

            # Need more data
            buffer_size = 4096
            try:
                buffer = self.socketID.recv(buffer_size)
            except OSError:
                raise RuntimeError("Error receiving data from TCP socket")

            if not buffer:
                # client disconnected
                return ""
            
            self.rest += buffer.decode("ascii", errors="replace")

if __name__ == '__main__':
    args = sys.argv[1:]
    ip = args[0]
    port = int(args[1])

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # create IPv4 TCP socket
    s.connect((ip, port))
    TCPDev = TCPDevice(s)
    while True:
        msg = input() # read from user
        msg += '\n'
        s.send(bytes(msg, 'utf-8')) # send to server

        print(TCPDev.getInput(), end="") # print to user
