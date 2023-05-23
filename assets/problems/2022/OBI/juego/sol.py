from collections import Counter
from typing import List


def final_zeros(val: int) -> int:
    return format(val, "b")[::-1].find("1")


def solve(array_1: List[int], array_2: List[int], k: int) -> int:
    array_1 = [final_zeros(x) for x in array_1]
    array_2 = [final_zeros(x) for x in array_2]
    res1 = Counter(array_1)
    res2 = Counter(array_2)

    res = 0
    for val1 in range(k + 1):
        res += res1[val1] * res2[k - val1]
    return res


if __name__ == "__main__":
    N, M, K = map(int, input().split())
    array_1 = map(int, input().split())
    array_2 = map(int, input().split())
    print(solve(array_1, array_2, K))
