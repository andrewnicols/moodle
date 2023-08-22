import TreeGrid from 'core/treegrid';

const table = document.querySelector('table');
table.setAttribute('role', 'treegrid');

TreeGrid.createTreeGrid(table);

const rows = Array.from(table.querySelectorAll('tr'))
    .filter((row) => row.closest('thead') === null);

rows[0].setAttribute('aria-expanded', false);
rows[0].setAttribute('aria-level', 1);

rows[1].setAttribute('aria-hidden', true);
rows[1].setAttribute('aria-level', 2);

rows[2].setAttribute('aria-hidden', true);
rows[2].setAttribute('aria-level', 2);

rows[3].setAttribute('aria-level', 1);
rows[3].setAttribute('aria-expanded', false);

rows[4].setAttribute('aria-level', 2);
rows[4].setAttribute('aria-hidden', true);
rows[4].setAttribute('aria-expanded', false);

rows[5].setAttribute('aria-level', 3);
rows[5].setAttribute('aria-hidden', true);

rows[6].setAttribute('aria-level', 1);
