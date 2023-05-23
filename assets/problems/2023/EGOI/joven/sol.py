def solve(Q: int, R: int) -> int:
    assert Q < R 
    assert 0 <= Q <= 10**6
    assert Q < R <= 10**6
    R -= 15
    Q -= 15
    for possible_k in range(R, 0, -1):
        saved_years = R // possible_k
        if R - saved_years <= Q:
            return possible_k
    return 0

def main():
    Q, R = map(int, input().split())
    print(solve(Q, R))

if __name__ == '__main__':
    main()

        