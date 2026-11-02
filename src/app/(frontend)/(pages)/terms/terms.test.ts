import assert from "node:assert/strict";
import test from "node:test";
import { officialTermsMarkdown } from "./official-terms";

test("contains all 31 approved Terms & Conditions sections in order", () => {
  const sectionNumbers = [...officialTermsMarkdown.matchAll(/^## (\d+)\./gm)].map(
    ([, number]) => Number(number),
  );

  assert.deepEqual(sectionNumbers, Array.from({ length: 31 }, (_, index) => index + 1));
  assert.match(officialTermsMarkdown, /^# Our Commitment$/m);
});

test("preserves approved dates, policy references, and official contact addresses", () => {
  assert.match(officialTermsMarkdown, /^\*\*Effective Date:\*\* Upon official approval and publication\s*$/m);
  assert.match(officialTermsMarkdown, /^\*\*Last Updated:\*\* 2 November 2026\s*$/m);
  assert.match(officialTermsMarkdown, /Code of Conduct/);
  assert.match(officialTermsMarkdown, /Privacy Policy/);
  assert.match(officialTermsMarkdown, /help\.d4community@gmail\.com/);
  assert.match(officialTermsMarkdown, /management\.d4community@gmail\.com/);
});
