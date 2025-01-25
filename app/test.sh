#!/bin/bash

# Initialize a Git directory
node main.js init

# Create a blob and hash an object
echo "Hello, World!" > test.txt
hash=$(node main.js hash-object test.txt)

# Read a blob
node main.js cat-file $hash

# Write a tree object
tree_hash=$(node main.js write-tree)

# Read a tree object
node main.js read-tree $tree_hash

# Create a commit
commit_hash=$(node main.js commit "Initial commit")

# Clone a repository (placeholder)
node main.js clone https://github.com/user/repo.git