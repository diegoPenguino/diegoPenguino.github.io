#include <iostream>
#include <map>

using namespace std;

int main() {
  map<int, bool> ceros;
  int pos = 1, salto = 2;
  while (pos <= 1000000000) {
    ceros[pos] = true;
    pos += salto;
    salto++;
  }
  int n, x;
  cin >> n;
  while (n--) {
    cin >> x;
    cout << (ceros[x] ? '0' : '1') << endl;
  }
  return 0;
}