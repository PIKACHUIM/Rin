const fs = require("fs");

const source = process.argv[2];
const target = process.argv[3];

const lines = fs.readFileSync(source, "utf8").split(/\r?\n/);
const statements = [];
let buffer = [];

for (const line of lines) {
  buffer.push(line);
  if (line.trimEnd().endsWith(";")) {
    statements.push(buffer.join("\n"));
    buffer = [];
  }
}
if (buffer.join("").trim()) statements.push(buffer.join("\n"));

const isCreateTable = (sql) => /^\s*CREATE TABLE(\s+IF NOT EXISTS)?\s/i.test(sql);
const isCreateIndex = (sql) => /^\s*CREATE (UNIQUE )?INDEX/i.test(sql);
const isInsert = (sql) => /^\s*INSERT INTO/i.test(sql);

// 按外键依赖排序：父表先插，子表后插
const PRIORITY = [
  "users",
  "hashtags",
  "friends",
  "feeds",
  "feed_hashtags",
  "comments",
  "visits",
  "visit_stats",
  "moments",
  "info",
  "cache",
];

function insertTable(sql) {
  const match = /^\s*INSERT INTO\s+[`"]?([a-zA-Z0-9_]+)[`"]?/i.exec(sql);
  return match ? match[1] : "zzz";
}

const rank = (name) => {
  const index = PRIORITY.indexOf(name);
  return index === -1 ? PRIORITY.length : index;
};

const tables = statements.filter(isCreateTable);
const indexes = statements.filter(isCreateIndex);
const inserts = statements
  .filter(isInsert)
  .map((sql, index) => ({ sql, index, name: insertTable(sql) }))
  .sort((a, b) => rank(a.name) - rank(b.name) || a.index - b.index)
  .map((item) => item.sql);

fs.writeFileSync(target, [...tables, ...indexes, ...inserts].join("\n") + "\n", "utf8");

const counts = {};
for (const sql of inserts) {
  const name = insertTable(sql);
  counts[name] = (counts[name] ?? 0) + 1;
}
console.log("tables:", tables.length, "indexes:", indexes.length, "inserts:", inserts.length);
console.log("insert order:", JSON.stringify(counts));
