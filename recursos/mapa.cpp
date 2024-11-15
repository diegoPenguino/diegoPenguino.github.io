#include <bits/stdc++.h>

using namespace std;

int main() {
    map<string, int> mapita;
    mapita["mundo"] = 2;
    mapita["hola"] = 1;

    auto it = mapita.begin();
    while (it != mapita.end()) {
        cout << it->first << " " << it->second << endl;
        it++;
    }

    for (auto it = mapita.begin(); it != mapita.end(); it++) {
        cout << it->first << " " << it->second << endl;
    }

    return 0;
}