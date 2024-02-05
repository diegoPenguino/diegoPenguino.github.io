/*
Todas las tiendas a la derecha
*/
#include <iostream>
#include <algorithm>

using namespace std;

int main() {
  int k, n;
  cin >> k >> n;
  pair<long long, long long> tiendas[n];
  for (int i = 0; i < n; i++) {
    cin >> tiendas[i].first;
  }
  for (int i = 0; i < n; i++) {
    cin >> tiendas[i].second;
  }
  sort(tiendas, tiendas + n);
  for (int i = 0; i < n; i++) {
    // comprar todos los caramelos posibles en tienda i
    k -= tiendas[i].second;
    // verificar si ya compre todos los que necesito
    if (k <= 0) {
      cout << abs(tiendas[i].first);
      break;
    }
  }
  if (k > 0) {
    cout << -1;
  }
  return 0;
}