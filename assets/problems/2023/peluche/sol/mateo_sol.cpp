#include <bits/stdc++.h>
#define lcm(a, b) (a / __gcd(a, b)) * b
#define efe                           \
    ios_base::sync_with_stdio(false); \
    cin.tie(0);                       \
    cout.tie(0);
#define pb push_back
#define F first
#define S second
#define vi vector<int>
#define ll long long
#define int long long
#define sz(x) (int)x.size()
#define all(x) x.begin(), x.end()
#define fore(i, a, b) for (int i = a, to = b; i < to; ++i)
#define foreD(i, a, b) for (int i = a, to = b; i >= to; --i)

#define ii pair<int, int>
using namespace std;
const int K = 20;
vector<int> g[1 << K];
int n;
int F[K][1 << K], D[1 << K];
void lca_dfs(int x) {
    fore(i, 0, g[x].size()) {
        int y = g[x][i];
        if (y == F[0][x])
            continue;
        F[0][y] = x;
        D[y] = D[x] + 1;
        lca_dfs(y);
    }
}

void lca_init() {
    D[0] = 0;
    F[0][0] = -1;
    lca_dfs(0);
    fore(k, 1, K) fore(x, 0, n) if (F[k - 1][x] < 0) F[k][x] = -1;
    else F[k][x] = F[k - 1][F[k - 1][x]];
}
int lca(int x, int y) {
    if (D[x] < D[y])
        swap(x, y);
    for (int k = K - 1; k >= 0; --k)
        if (D[x] - (1 << k) >= D[y])
            x = F[k][x];
    if (x == y)
        return x;
    for (int k = K - 1; k >= 0; --k)
        if (F[k][x] != F[k][y])
            x = F[k][x], y = F[k][y];
    return F[0][x];
}
int val[1 << K];
signed main() {
    efe int q;
    cin >> q >> n;
    for (int i = 0; i < n; i++) {
        g[i].pb(2 * i + 1);
        g[i].pb(2 * i + 2);
    }
    lca_init();
    val[0] = 0;
    val[1] = 1;
    for (int i = 2; i < n; i++) {
        val[i] = val[i - 1] + val[i - 2];
    }
    int a, b;
    while (q--) {
        cin >> a >> b;
        int res = 0;
        for (int i = 0; i < n; i++) {
            // a está entre val[i] y val[F[0][i]]
            if (a > val[i] or a < val[F[0][i]])
                continue;
            for (int l = i; l < n; l++) {
                // n esta entre val[l] y val[F[0][l]]
                if (b > val[l] or b < val[F[0][l]])
                    continue;
                if (i == l) {
                    res = max(res, abs(a - b));
                } else {
                    int lc = lca(i, l);
                    res = max(res, a + b - 2 * val[lc]);
                }
            }
        }
        cout << res << "\n";
    }

    return 0;
}
// sigan viendo
