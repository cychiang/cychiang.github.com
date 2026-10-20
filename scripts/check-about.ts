// Validate the about page's sections. Exits non-zero on problems.
import { listSections, validateSection, validateSections } from './lib/about.ts';

const sections = await listSections();
let failed = 0;

for (const section of sections) {
  const problems = validateSection(section);
  if (problems.length === 0) {
    console.log(`ok    about/${section.tab}.md${section.draft ? ' (draft)' : ''}`);
    continue;
  }
  failed += 1;
  console.error(`FAIL  about/${section.tab}.md`);
  for (const problem of problems) console.error(`      - ${problem}`);
}

const overall = validateSections(sections);
for (const problem of overall) console.error(`FAIL  ${problem}`);

if (failed > 0 || overall.length > 0) {
  console.error('\nThe about page needs fixing. See AGENTS.md, "The about page".');
  process.exit(1);
}
console.log(`\n${sections.length} about section(s) checked.`);
