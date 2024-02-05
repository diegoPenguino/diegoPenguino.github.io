#include "bits/stdc++.h"

using namespace std;

#define ll long long
#define all(x) x.begin(), x.end()
#define ii pair<int, int>
#define vi vector<int>

vector<ll> fib, pref;

int main() {
    int t, n;
    scanf("%d %d", &t, &n);

    fib.resize(n);
    fib[0] = 0, fib[1] = 1;
    for (int i = 2; i < n; i++)
        fib[i] = fib[i - 1] + fib[i - 2];

    bool ante[n][n] = {};
    ante[0][0] = true;
    for (int i = 1; i < n; i++) {
        int pa = (i - 1) / 2;
        for (int j = 0; j < n; j++)
            ante[i][j] = ante[pa][j];
        ante[i][i] = true;
    }

    int lca[n][n];
    for (int i = 0; i < n; i++)
        lca[i][0] = lca[0][i] = 0;
    for (int i = 1; i < n; i++)
        for (int j = 1; j < n; j++) {
            if (ante[i][j] || ante[i][j]) {
                lca[i][j] = lca[j][i] = min(i, j);
                continue;
            }
            lca[i][j] = lca[j][i] = lca[i][(j - 1) / 2];
        }

    while (t--) {
        ll a, b;
        scanf("%lld %lld", &a, &b);

        vi A, B, A_down, B_down;
        for (int i = 0; i < n; i++) {
            if (fib[i] == a)
                A.push_back(i), A_down.push_back(i);
            if (fib[i] == b)
                B.push_back(i), B_down.push_back(i);

            if (2 * i + 1 < n && fib[i] < a && a < fib[2 * i + 1])
                A.push_back(i), A_down.push_back(2 * i + 1);
            if (2 * i + 2 < n && fib[i] < a && a < fib[2 * i + 2])
                A.push_back(i), A_down.push_back(2 * i + 2);

            if (2 * i + 1 < n && fib[i] < b && b < fib[2 * i + 1])
                B.push_back(i), B_down.push_back(2 * i + 1);
            if (2 * i + 2 < n && fib[i] < b && b < fib[2 * i + 2])
                B.push_back(i), B_down.push_back(2 * i + 2);
        }

        ll res = 0;
        for (int i = 0; i < A.size(); i++)
            for (int j = 0; j < B.size(); j++) {
                int x = A[i], y = B[j];
                if (ante[A_down[i]][B_down[j]] || ante[B_down[j]][A_down[i]]) {
                    res = max(res, abs(a - b));
                    continue;
                }

                res = max(res, a + b - 2LL * fib[lca[x][y]]);
            }
        printf("%lld\n", res);
    }

    return 0;
}
