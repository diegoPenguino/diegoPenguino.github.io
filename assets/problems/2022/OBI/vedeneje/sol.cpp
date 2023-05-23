#include <bits/stdc++.h>

using namespace std;

const int modulo = 1000000007;
#define boundary 3e7

vector<int> fibo(boundary);

void calculateFibonacci() {
    fibo[0] = 1;
    fibo[1] = 1;
    for (int i = 2; i < boundary; ++i) {
        fibo[i] = fibo[i - 1] + fibo[i - 2];
        fibo[i] %= modulo;
    }
}

int getFibo(int pos) {
    if (pos > 0)
        return fibo[pos];
    return 1;
}

int modulizar(int val) {
    while (val < 0) {
        val += modulo;
    }
    return val % modulo;
}

int solve(int x1, int y1, int x2, int y2) {
    int x, a, b;
    x = (y1 - x1) * 2;
    b = x2 - x1;
    a = y2 - y1;
    return modulizar(getFibo(x + 2 * a + 2) - getFibo(x + 2 * a - 2 * b) - getFibo(x) +
                     getFibo(x - 2 * b - 2));
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int Q, x1, y1, x2, y2;
    calculateFibonacci();
    cin >> Q;
    while (Q--) {
        cin >> x1 >> y1 >> x2 >> y2;
        cout << solve(x1, y1, x2, y2) << '\n';
    }
    return 0;
}