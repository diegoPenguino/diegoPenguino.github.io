if __name__ == "__main__":
    i = False
    val = 0
    oh_no = []
    while val <= 10**18:
        oh_no.append(val)
        if i:
            val *= 2
        else:
            val *= 2
            val += 1
        i = not i
    N = int(input())
    lista = map(int, input().split())
    for num in lista:
        if num in oh_no:
            print("OSEA NO")
        else:
            print("OK")
