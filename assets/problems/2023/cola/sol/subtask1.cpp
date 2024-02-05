#include <bits/stdc++.h>

using namespace std;

int main() {
    int n, x;
    cin >> n;
    while (n--) {
        cin >> x;
        if (x == 1 or x == 3 or x == 6 or x == 10 or x == 15)
            cout << 0 << endl;
        else
            cout << 1 << endl;
    }
    return 0;
}