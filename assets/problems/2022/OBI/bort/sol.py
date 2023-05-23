from math import sqrt


def isTriangular(num: int) -> bool:
    n = 1.0 * (-1 + sqrt(1 + 8 * num)) / 2
    if int(n) == n:
        return True
    return False


if __name__ == "__main__":
    N = input()
    nums = list(map(int, input().split()))
    for num in nums:
        if isTriangular(num):
            print("SI")
        else:
            print("NO")
"""
8
1 5 6 63 1000 2114596 17877210 123750
"""
