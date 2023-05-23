#include <bits/stdc++.h>

using namespace std;

int solve(long long N, long long K) {
    int steps = 0;
    while (N > 1) {
        if (N % K == 0)
            N = N / K;
        else
            N = N / K + 1;
        steps++;
    }
    return steps;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    long long N, K, Q;
    int test;
    double ans;
    cin >> Q;
    while (Q--) {
        cin >> N >> K;
        cout << N - 1 << " " << solve(N, K) << '\n';
    }
    return 0;
}