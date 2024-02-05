#include <bits/stdc++.h>

using namespace std;

int main() {
    string cola = "";
    for (int i = 0; i < 10010; ++i) {
        cola += "1";
    }
    int pos = 1, salto = 2;
    while (pos < 10000) {
        cola[pos] = '0';
        pos += salto;
        salto++;
    }
    int n, x;
    cin >> n;
    while (n--) {
        cin >> x;
        cout << cola[x] << endl;
    }
    return 0;
}