// tres tiendas, dos ciclos for anidados
// c_i = 1, k = 2
#include <iostream>

using namespace std;

int main() {
  int k, n;
  cin >> k >> n;
  long long pos[3];
  long long cnt[3];
  cin >> pos[0] >> pos[1] >> pos[2];
  cin >> cnt[0] >> cnt[1] >> cnt[2];
  int res = -1;
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      if (i == j) continue;
      // ir a tienda i y luego a tienda j
      long long dist = abs(pos[i]) + abs(pos[j] - pos[i]);
      if (res == -1 || dist < res) {
        res = dist;
      }
    }
  }
  cout << res << endl;
  return 0;
}