// solo una tienda
#include <iostream>

using namespace std;

int main() {
  int k, n;
  cin >> k >> n;
  int pos, cnt;
  cin >> pos >> cnt;
  if (cnt >= k) {
    cout << abs(pos);
  }
  else {
    cout << -1;
  }
  return 0;
}