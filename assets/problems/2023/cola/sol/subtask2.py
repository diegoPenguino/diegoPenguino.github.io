cola = "1"*10010

pos = 1
salto = 2
while pos <= 10**4:
    cola = cola[:pos] + "0" + cola[pos+1:]
    pos += salto
    salto += 1

N = int(input())
for _ in range(N):
    X = int(input())
    print(cola[X])
    