#include <iostream>

using namespace std;

int main() {
  string s;
  getline(cin, s);
  for (int i = 0; i < s.size(); i++) {
    if (s.substr(i, 2) == "AC" || s.substr(i, 2) == "OK" || s.substr(i, 2) == "WA") {
      cout << s.substr(i, 2);
    }
  }
  getline(cin, s);
  for (int i = 0; i < s.size(); i++) {
    if (s.substr(i, 2) == "AC" || s.substr(i, 2) == "OK" || s.substr(i, 2) == "WA") {
      cout << s.substr(i, 2);
    }
  }
  return 0;
}