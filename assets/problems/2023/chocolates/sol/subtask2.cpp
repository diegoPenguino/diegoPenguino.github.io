// dos tiendas, hardcodeado
#include <iostream>

using namespace std;

int main() {
  int k, n;
  cin >> k >> n;
  long long pos[2];
  long long cnt[2];
  cin >> pos[0] >> pos[1];
  cin >> cnt[0] >> cnt[1];
  long long res = -1;
  // ir solo a tienda 1
  if (cnt[0] >= k) {
    if (res == -1 or abs(pos[0]) < res) {
      res = abs(pos[0]);
    }
  }
  // ir solo a tienda 2
  if (cnt[1] >= k) {
    if (res == -1 or abs(pos[1]) < res) {
      res = abs(pos[1]);
    }
  }
  // ir a tienda 1 y luego a tienda 2
  if (cnt[0] + cnt[1] >= k) {
    long long dist = abs(pos[0]) + abs(pos[1] - pos[0]);
    if (res == -1 or dist < res) {
      res = dist;
    }
  }
  // ir a tienda 2 y luego a tienda 1
  if (cnt[0] + cnt[1] >= k) {
    long long dist = abs(pos[1]) + abs(pos[0] - pos[1]);
    if (res == -1 or dist < res) {
      res = dist;
    }
  }
  cout << res;
  return 0;
}