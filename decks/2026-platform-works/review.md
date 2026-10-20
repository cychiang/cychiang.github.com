---
title: "Review: Building an API-first platform with Crossplane"
description: Open review comments on the platform deck. Each item names a slide and proposes a change; resolved items are deleted, and the file goes before the deck is published.
tags:
  - crossplane
  - platform-engineering
---
# Review

How this file works: a reviewer (a person or an agent) adds items here instead of editing `slides.md`. Each item names the slide, says what is wrong, and proposes the change in full, so it can be pasted in. The author applies what they agree with in OpenKnowledge and deletes the item; to reject one, delete it too. When nothing is left, delete this file. It is never published, and it should be gone before `card.draft` is set to `false`.

## Round 1 — 2026-10-11

### 1. "Upgrades once, for everyone" cuts both ways

Slide: **Modules versus a platform API** (the comparison table).

Problem: the table sells central upgrades, but a bad Composition change also reaches every team at once. That is the same blast-radius worry the deck raises later about shared accounts, and someone will ask.

Proposed: add one line under the table so the slide carries its own answer.

```md
A change to a Composition reaches everyone too, so it goes out like any release: a new revision, tried on one team first.
```

And add to the speaker notes of that slide: "Composition revisions let a composite move to the new revision when we say so, not when the file lands."

### 2. The problem part has no numbers

Slide: **Getting infrastructure was the bottleneck**.

Problem: the content rules ask for something concrete behind a claim. Three adjectives (slow, risky, bounced) make the point, but one figure would anchor it.

Proposed: one rounded, generic figure in the first bullet, if there is a source for it.

```md
- **Slow**: a request took days to weeks, waiting on manual checks and approvals
```

TODO (author): replace "days to weeks" with the real order of magnitude, or leave the bullet as it is if no honest figure exists. Do not invent one.

### 3. Migration is missing

Between **Handing out code hands out the lifecycle too.** and **Why Kubernetes and Crossplane**.

Problem: the deck jumps from modules to Crossplane without saying what happened to the resources Terraform already managed. Imported, left alone, or rebuilt?

Proposed: one sentence in the speaker notes of the **Crossplane splits the API from how it is built** slide (no new slide needed):

```md
Existing resources were not rebuilt: new requests go through the API, and what Terraform already managed stays with Terraform until it is replaced.
```

TODO (author): adjust to what actually happened.

### 4. The trade-off lives only in the speaker notes

Slide: **Modules versus a platform API**.

Problem: "we now run a control plane" and "when Terraform is still right" are in the notes, but the content rules ask a deck to state its trade-off where the audience can see it.

Proposed: a last row in the table.

```md
| The cost | a pipeline per team | a control plane to keep up |
```

## Before publishing

- [ ] Items above resolved or rejected, and this file deleted.
- [ ] `card.event` and `card.links` filled in once the talk has been given.
- [ ] `card.draft: false`, then `pnpm check && pnpm build`.
