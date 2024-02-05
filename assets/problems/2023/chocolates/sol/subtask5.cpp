/*
Solo una tienda a la izquierda
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
  // tiendas[0] es la tienda a la izquierda
  long long res = -1;
  // moverse solo a tienda 0 (izquierda)
  if (tiendas[0].second >= k) {
    res = abs(tiendas[0].first);
  }
  // 3 posibilidades de moverse:
  // - moverse solo a la derecha hacia tienda i
  // - moverse a tienda i y luego a tienda 0
  // - moverse a tienda 0 y luego a tienda i
  // En todas ellas compramos los caramelos de las tiendas por las que pasamos
  long long sumaCaramelos = 0;
  for (int i = 1; i < n; i++) {
    sumaCaramelos += tiendas[i].second;
    // moverse solo a la derecha hacia tienda i
    if (sumaCaramelos >= k) {
      long long dist = abs(tiendas[i].first);
      if (res == -1 or dist < res) {
        res = dist;
      }
    }
    // moverse a tienda i y luego a tienda 0
    if (sumaCaramelos + tiendas[0].second >= k) {
      long long dist = abs(tiendas[i].first) + abs(tiendas[0].first - tiendas[i].first);
      if (res == -1 or dist < res) {
        res = dist;
      }
    }
    // moverse a tienda 0 y luego a tienda i
    if (sumaCaramelos + tiendas[0].second >= k) {
      long long dist = abs(tiendas[0].first) + abs(tiendas[i].first - tiendas[0].first);
      if (res == -1 or dist < res) {
        res = dist;
      }
    }
  }
  cout << res;
  return 0;
}