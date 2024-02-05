def solve(X):
    det = 1 + 8*X
    n = (-1 + det**0.5)/2
    return 0 if n == int(n) else 1

def main():
    N = int(input())
    for _ in range(N):
        X = int(input())
        print(solve(X))

if __name__ == '__main__':
    main()