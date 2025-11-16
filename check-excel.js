const XLSX = require('xlsx');

// Baca file Excel
const workbook = XLSX.readFile('REKAP BUKU.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert ke JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== STRUKTUR DATA BUKU ===\n');
console.log('Total buku:', data.length);
console.log('\nKolom yang tersedia:');
if (data.length > 0) {
  Object.keys(data[0]).forEach(key => {
    console.log(`- ${key}`);
  });
}

console.log('\n=== CONTOH DATA (5 buku pertama) ===\n');
data.slice(0, 5).forEach((book, index) => {
  console.log(`${index + 1}.`, JSON.stringify(book, null, 2));
});
