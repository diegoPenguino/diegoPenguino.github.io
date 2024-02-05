T, N = map(int, input().split())
for _ in range(T):
    A, B = map(int, input().split())
    print(max(A,B) - min(A,B))