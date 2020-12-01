#include <iostream>
#include <stdlib.h>
#include <stdio.h> 
#include <string>
using namespace std;

int main(int argc, const char *argv[])
{
    //// argv[0]  itemPath
    //// argv[1]  username
    string itemPath = argv[1];
    string username = argv[2];
    string command = "getfacl -cp " + itemPath + "grep \'user:" + username + ":\'";
    system(command.c_str());
    //cout << "output "
    return 0;
}