#include <bits/stdc++.h>

using namespace std;

/*
    Tenemos una lista de numeros ordenada(maximo tamano 10^6), y queremos buscar un numero en ella.
    Hay que responder K consultas, donde cada consulta indica la posicion del numero buscado
    en la lista.
    Si el numero no esta en la lista, se imprime -1.
*/

int n, k;
vector<long long> lista(1000005);

int buscar(long long valor) {
    int ini = 0, fin = n - 1, mid;
    while (true) {
        if (ini > fin) {
            return -1;
        }
        mid = (ini + fin) / 2;
        if (lista[mid] == valor) {
            return mid;
        }
        if (valor > lista[mid]) {
            ini = mid + 1;
        } else {
            fin = mid - 1;
        }
    }
}

int main() {
    cin >> n;

    for (int i = 0; i < n; ++i) {
        cin >> lista[i];
    }

    cin >> k;
    long long valor;
    while (k--) {
        cin >> valor;
        cout << buscar(valor) << endl;
    }

    return 0;
}