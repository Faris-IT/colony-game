let pass = 0, fail = 0; const verbose = process.argv.includes('-v');
module.exports = {
  section(n){ console.log('\n' + n); },
  ok(c, m){ if(c){ pass++; if(verbose) console.log('  [lulus] ' + m); } else { fail++; console.log('  [GAGAL] ' + m); } },
  info(m){ console.log('  ' + m); },
  summary(){ console.log('\n' + (fail ? 'GAGAL: ' + fail + ' pengujian gagal, ' + pass + ' lulus.' : 'SEMUA LULUS: ' + pass + ' pengujian.')); process.exitCode = fail ? 1 : 0; }
};
