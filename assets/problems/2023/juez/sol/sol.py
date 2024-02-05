import sys

def search(line: str) -> str:
    if (line.find("AC") != -1):
        return "AC"
    elif line.find("OK") != -1:
        return "OK"
    return ""

for line in sys.stdin:
    if search(line):
        print(search(line))
        break
else:
    print("WA")