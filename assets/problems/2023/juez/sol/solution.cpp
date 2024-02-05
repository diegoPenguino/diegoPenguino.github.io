#include <iostream>
#include <cassert>

using namespace std;

int main() {
  string s;
  while (cin >> s) {
    for (int i = 0; i < s.size(); i++) {
      if (s.substr(i, 2) == "AC") {
        cout << "AC";
        return 0;
      }
      if (s.substr(i, 2) == "OK") {
        cout << "OK";
        return 0;
      }
      if (s.substr(i, 2) == "WA") {
        cout << "WA";
        return 0;
      }
    }
  }
  assert(false);
}