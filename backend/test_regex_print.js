const queries = ['A', 'Ah', 'Ahm', 'Ali', 'Z', 'Muhammad'];
console.log('Query -> MongoDB regex pattern');
console.log('='.repeat(45));
queries.forEach(q => {
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp('^' + escapedQ, 'i');
  console.log('q=' + JSON.stringify(q).padEnd(14) + ' -> ' + prefixRegex.toString());
});
