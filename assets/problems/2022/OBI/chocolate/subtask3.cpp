#include <bits/stdc++.h>

using namespace std;

int main() {
    long long N, K, Q;
    double ans;
    cin>>Q;
    while(Q--){
        cin>>N>>K;
        ans = log2(N);
        cout << N - 1 << " " << int(ans) <<'\n';
    }
    return 0;
}