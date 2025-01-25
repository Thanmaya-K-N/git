const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    const hash = process.argv[4];
    catFile(hash);
    break;
  case "hash-object":
    hashGitObject(process.argv[4]);
    break;
    case "write-tree":
      writeTree();
      break;
    case "read-tree":
      const treeHash = process.argv[4];
      readTree(treeHash);
      break;
    case "commit":
      const message = process.argv[4];
      createCommit(message);
      break;
    case "clone":
      const url = process.argv[4];
      cloneRepository(url);
      break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

async function catFile(hash){
    const content = await fs.readFileSync(path.join(process.cwd(), ".git", "objects", hash.slice(0,2), hash.slice(2)));
    const dataUnzipped = zlib.inflateSync(content);
    const res = dataUnzipped.toString().split('\0')[1];
    process.stdout.write(res);
}

function hashGitObject(file){
  const header = `blob ${data.length}\0`;
  const store = header + data;
  const hash = crypto.createHash('sha1').update(store).digest('hex');
  const dir = path.join(GIT_DIR, 'objects', hash.substring(0, 2));
  const file = path.join(dir, hash.substring(2));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(file, zlib.deflateSync(store));
  console.log(hash);
}

function writeTree() {
  const files = fs.readdirSync('.');
  let tree = '';
  files.forEach(file => {
    if (file === GIT_DIR) return;
    const stats = fs.statSync(file);
    const mode = stats.isDirectory() ? '40000' : '100644';
    const hash = hashGitObject(fs.readFileSync(file));
    tree += `${mode} ${file}\0${Buffer.from(hash, 'hex')}`;
  });
  return hashGitObject(tree);
}

function readTree(hash) {
  const dir = path.join(GIT_DIR, 'objects', hash.substring(0, 2));
  const file = path.join(dir, hash.substring(2));
  const data = zlib.inflateSync(fs.readFileSync(file)).toString();
  let i = 0;
  while (i < data.length) {
    const modeEnd = data.indexOf(' ', i);
    const mode = data.substring(i, modeEnd);
    const nameEnd = data.indexOf('\0', modeEnd + 1);
    const name = data.substring(modeEnd + 1, nameEnd);
    const hash = data.substring(nameEnd + 1, nameEnd + 21).toString('hex');
    console.log(`${mode} ${name} ${hash}`);
    i = nameEnd + 21;
  }
}

function createCommit(message) {
  const tree = writeTree();
  const parent = getHead();
  const author = 'Your Name <you@example.com>';
  const timestamp = Math.floor(Date.now() / 1000);
  const commit = `tree ${tree}\nparent ${parent}\nauthor ${author} ${timestamp} +0000\ncommitter ${author} ${timestamp} +0000\n\n${message}\n`;
  const hash = hashGitObject(commit);
  fs.writeFileSync(path.join(GIT_DIR, 'refs', 'heads', 'master'), hash);
  console.log(hash);
}

function getHead() {
  const headPath = path.join(GIT_DIR, 'refs', 'heads', 'master');
  return fs.existsSync(headPath) ? fs.readFileSync(headPath, 'utf8').trim() : '';
}

function cloneRepository(url) {
  // This is a placeholder for the clone functionality
  console.log(`Cloning repository from ${url}`);
}