#include <bits/stdc++.h>

using namespace std;

#define ll long long

bool solve(ll x_0, ll y_0, ll x, ll y, char ch) {
    x -= x_0;
    y -= y_0;
    x += y;
    if (x % 2) {
        return ch == 'N';
    } else {
        return ch == 'B';
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    ll N, x_0, y_0, x, y;
    char ch;
    cin >> N;
    cin >> x_0 >> y_0;
    while (N--) {
        cin >> x >> y;
        cin >> ch;
        cout << (solve(x_0, y_0, x, y, ch) ? "SI" : "NO") << "\n";
    }
    return 0;
}