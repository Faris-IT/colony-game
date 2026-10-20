// Menjalankan seluruh pengujian: node tests/run.js  (tambah -v untuk melihat semua baris)
const R = require('./report');
['smoke', 'rules', 'balance'].forEach(n => require('./' + n + '.test.js'));
R.summary();
