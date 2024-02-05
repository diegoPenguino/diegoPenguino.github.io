def solve(A: int, B: int) -> int:
    fibo = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986]
    if A != B:
        return max(A, B) - min(A, B)
    else:
        i = 0
        while fibo[i] < A:
            i += 1
        i -= 1
        return 2*(A - fibo[i])

def main():
    T = int(input())
    
    for _ in range(T):
        A, B = map(int, input().split())
        print(solve(A, B))

if __name__ == '__main__':
    main()