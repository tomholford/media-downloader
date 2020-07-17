import DuplicateRemove from './duplicate_remover.ts';

const d = new DuplicateRemove('.');
const map = await d.duplicates()

console.log(map);