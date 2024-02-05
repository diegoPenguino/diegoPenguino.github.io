#include <iostream>
#include <vector>

using namespace std;
long long fiboarbol[70];

int lca(long long u, long long v) {
    while (u != v) {
        if (v > u) {
            v = (v - 1) / 2;
        } else {
            u = (u - 1) / 2;
        }
    }
    return u;
}

int main() {
    long long N = 64, t, n, A, B;
    fiboarbol[0] = 0;
    fiboarbol[1] = 1;
    for (int i = 2; i <= 64; i++) {
        fiboarbol[i] = fiboarbol[i - 1] + fiboarbol[i - 2];
    }

    cin >> t >> n;
    while (t--) {
        cin >> A >> B;
        vector<long long> ac_A;
        vector<long long> ac_B;
        for (int i = 1; i < n; i++) {
            long long v_x = fiboarbol[(i - 1) / 2];
            long long v_y = fiboarbol[i];
            if (v_x <= A && A <= v_y) {
                ac_A.push_back(i);
            }
            if (v_x <= B && B <= v_y) {
                ac_B.push_back(i);
            }
        }
        long long max_diff = 0;
        for (int i = 0; i < ac_A.size(); i++) {
            for (int j = 0; j < ac_B.size(); j++) {
                long long a = ac_A[i];
                long long b = ac_B[j];
                long long diff = abs(A - B);
                if (a != b) {
                    long long n_lca = lca(a, b);
                    diff = A - fiboarbol[n_lca] + B - fiboarbol[n_lca];
                }
                max_diff = max(max_diff, diff);
            }
        }
        cout << max_diff << "\n";
    }

    return 0;
}