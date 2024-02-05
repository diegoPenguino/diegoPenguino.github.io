/*
Solucion completa
Moverse primero a la derecha y luego a la izquierda o al revez
O(n) con tecnica "two pointers"
Tambien se puede hacer con busqueda binaria en O(nlogn)
*/
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

signed main() {
  int k, n;
  cin >> k >> n;
  pair<long long, long long> todasTiendas[n];
  for (int i = 0; i < n; i++) {
    cin >> todasTiendas[i].first;
  }
  for (int i = 0; i < n; i++) {
    cin >> todasTiendas[i].second;
  }
  // separar tiendas a la izquierda y a la derecha
  vector<pair<long long, long long>> tiendasIzq, tiendasDer;
  for (int i = 0; i < n; i++) {
    if (todasTiendas[i].first < 0) {
      tiendasIzq.push_back(todasTiendas[i]);
    } else {
      tiendasDer.push_back(todasTiendas[i]);
    }
  }
  sort(tiendasIzq.begin(), tiendasIzq.end());
  sort(tiendasDer.begin(), tiendasDer.end());
  long long res = -1;
  
  //  TWO POINTERS

  // ir a la izquierda y luego a la derecha
  long long chocoIzq = 0, chocoDer = 0;
  for (int i = 0; i < tiendasIzq.size(); i++) {
    chocoIzq += tiendasIzq[i].second;
  }
  // punteros a las ultimas tiendas que visitara a la izquierda y a la derecha
  int izq, der = -1;
  for (izq = 0; izq < tiendasIzq.size(); izq++) {
    while (chocoIzq + chocoDer < k && der+1 < tiendasDer.size()) {
      der++;
      chocoDer += tiendasDer[der].second;
    }
    if (chocoIzq + chocoDer >= k) {
      long long dist = abs(tiendasIzq[izq].first);
      if (der != -1) {
        dist += abs(tiendasDer[der].first - tiendasIzq[izq].first);
      }
      if (res == -1 or dist < res) {
        res = dist;
      }
    }
    chocoIzq -= tiendasIzq[izq].second;
  }
  
  // ir a la derecha y luego a la izquierda
  chocoIzq = 0, chocoDer = 0;
  for (int i = 0; i < tiendasDer.size(); i++) {
    chocoDer += tiendasDer[i].second;
  }
  // punteros a las ultimas tiendas que visitara a la izquierda y a la derecha
  izq = tiendasIzq.size(), der;
  for (der = tiendasDer.size()-1; der >= 0; der--) {
    while (chocoIzq + chocoDer < k && izq-1 >= 0) {
      izq--;
      chocoIzq += tiendasIzq[izq].second;
    }
    if (chocoIzq + chocoDer >= k) {
      long long dist = abs(tiendasDer[der].first);
      if (izq != tiendasIzq.size()) {
        dist += abs(tiendasIzq[izq].first - tiendasDer[der].first);
      }
      if (res == -1 or dist < res) {
        res = dist;
      }
    }
    chocoDer -= tiendasDer[der].second;
  }

  cout << res;
  return 0;
}