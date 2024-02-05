n = int(input())
for _ in range(n):
    a, b = map(int, input().split())
    print(max(a, b) - min(a, b))