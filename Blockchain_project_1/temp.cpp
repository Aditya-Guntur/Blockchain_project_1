#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

vector<int> solve(const vector<string>& adj) {
    int n = adj.size();
    vector<pair<int, int>> degree;  // (edge count, vertex number)
    
    // Count edges for each vertex
    for (int i = 0; i < n; i++) {
        int edges = 0;
        for (char c : adj[i]) {
            edges += (c - '0');
        }
        degree.push_back({edges, i + 1}); // Store degree and 1-based vertex index
    }
    
    // Sort by degree (descending)
    sort(degree.rbegin(), degree.rend());
    
    // Extract permutation
    vector<int> p;
    for (auto [deg, vertex] : degree) {
        p.push_back(vertex);
    }
    
    return p;
}

int main() {
    int t;
    cin >> t;
    
    while (t--) {
        int n;
        cin >> n;
        
        // Read the adjacency matrix as strings
        vector<string> adj(n);
        for (int i = 0; i < n; i++) {
            cin >> adj[i];
        }
        
        // Solve for the permutation
        vector<int> permutation = solve(adj);
        
        // Output the permutation
        for (int i = 0; i < n; i++) {
            cout << permutation[i];
            if (i < n-1) cout << " ";
        }
        cout << endl;
    }
    
    return 0;
}