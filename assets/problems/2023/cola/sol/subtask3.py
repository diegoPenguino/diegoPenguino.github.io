ceros = {}

pos = 1
salto = 2
while pos <= 10**9:
    ceros[pos] = True
    pos += salto
    salto += 1

N = int(input())
for _ in range(N):
    X = int(input())
    if ceros.get(X):
        print(0)
    else:
        print(1)
    