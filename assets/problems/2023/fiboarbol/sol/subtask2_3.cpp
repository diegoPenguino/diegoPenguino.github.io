#include <bits/stdc++.h>

using namespace std;

int main() {
    long long n, a, b;
    cin >> n;
    while (n--) {
        cin >> a >> b;
        if (a < b)
            swap(a, b);
        cout << a - b << '\n';
    }
    return 0;
}