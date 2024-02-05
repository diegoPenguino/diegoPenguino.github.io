#include <iostream>

using namespace std;

int main() {
  string s;
  cin >> s;
  if (s[0] == 'A' && s[1] == 'C') {
    cout << "AC";
  }
  else if (s[0] == 'O' && s[1] == 'K') {
    cout << "OK";
  }
  else if (s[0] == 'W' && s[1] == 'A') {
    cout << "WA";
  }
  else {
    cout << s[1] << s[2];
  }
  return 0;
}