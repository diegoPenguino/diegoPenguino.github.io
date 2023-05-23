def is_it(val: int) -> bool:
    i = val % 2
    while val >= 1:
        if val % 2 != i:
            return False
        if i == 1:
            i = 0
        else:
            i = 1
        val //= 2

    return True


if __name__ == "__main__":
    N = int(input())
    lista = map(int, input().split())
    for num in lista:
        if is_it(num):
            print("OSEA NO")
        else:
            print("OK")
