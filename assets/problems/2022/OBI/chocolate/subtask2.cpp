#include <bits/stdc++.h>

using namespace std;

struct Chocolate{
    int size;
    int veces_partido;
};

int main() {
    int N, K, partes_1, partes_2, max_partidas, partidas, Q;
    cin>>Q;
    while(Q--){
        cin >> N >> K;
        max_partidas = 0;
        partidas = 0;
        Chocolate chocolate, choco_1, choco_2;
        chocolate.size = N;
        chocolate.veces_partido = 0;

        queue<Chocolate> particiones;
        particiones.push(chocolate);

        while(!particiones.empty()) {
            chocolate = particiones.front();
            particiones.pop();
            if(chocolate.size > 1) {
                choco_1.size = chocolate.size/K;
                choco_2.size = chocolate.size/K + 1;
                choco_1.veces_partido = chocolate.veces_partido + 1;
                choco_2.veces_partido = chocolate.veces_partido + 1;
                partes_2 = chocolate.size % K;
                partes_1 = K - partes_2;
                while(partes_1--){
                    particiones.push(choco_1);
                }
                while(partes_2--){
                    particiones.push(choco_2);
                }
            } else if(chocolate.size == 1) {
                max_partidas = max(max_partidas, chocolate.veces_partido);
            }
        }
        cout << N - 1 << " " << max_partidas << '\n';
    }
    return 0;
}