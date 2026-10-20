---
title: "Notes: Building an API-first platform with Crossplane"
description: The working note for the platform deck — summary, flow, lines to land and things to say carefully. Not published.
tags:
  - crossplane
  - platform-engineering
---
# Notes

The working note for [the deck](slides.md). Open review comments live in [review.md](review.md) until they are resolved.

## Summary

**The claim:** handing out infrastructure code hands out its lifecycle too. To keep the lifecycle, the platform team should offer an API, not modules.

1. **The problem.** Getting infrastructure took too long. It was risky, and requests went back and forth between teams. Every request was a ticket that waited on manual checks and approvals.
2. **First try: Terraform modules.** Modules made the code easier to write, but each team pinned its own module, Terraform and provider versions. Fixes reached only the teams that upgraded, and nobody could say what was actually running.
3. **Crossplane.** Kubernetes already serves desired state through an API and keeps reconciling it. Crossplane extends that to cloud and on-prem resources. The platform team owns the XRD, the Composition and the Provider. A developer writes one small request. Upgrades happen once for everyone, and drift is corrected all the time.
4. **What came next.** Once requests were easy, the next problems showed: ownership, tags and blast radius (so each team gets its own account). Developers also need status in their own words, and permission over their own requests only, without having to learn Kubernetes.

**Closing line:** the API is the product. Kubernetes is how we run it.

## Flow of the talk

| Part | Slides | Job of the part |
| --- | --- | --- |
| Problem | Bottleneck, ticket diagram, what we wanted | Make the audience feel the queue |
| Terraform modules | Section, drift, three realities, statement | Show why sharing code isn't enough |
| Crossplane | Section, desired state, reconcile loop, pieces, after diagram, comparison | Explain the model and who owns what |
| What came next | Section, ownership, per-team accounts, status, permissions | Show the work isn't finished |
| Close | Statement, exit | One line to remember |

## Lines to land

- "Every box is a person or a queue, so every arrow is waiting time." (the ticket diagram)
- "Handing out code hands out the lifecycle too." (the turn of the talk)
- "We use Kubernetes for its API server and reconcile engine, not for containers."
- "Three of the four pieces belong to the platform team."
- "The API is the product. Kubernetes is how we run it."

## Things to say carefully

- **Crossplane v1 vs v2:** a claim in v1, a namespaced composite resource in v2. Use whatever term matches what is running.
- **When Terraform is still right:** one team applying from one central pipeline gets most of the benefit. What it doesn't give you is a request API that many teams can use.
- **The cost:** we now run a control plane. It has to be as reliable as the resources it manages.
- **Nothing confidential:** keep every example generic (a `Database` with a size, team A and team B).

## Likely audience questions

Prepare an answer; none of these needs a slide.

- How does a request pick the right team account? (a provider configuration per account; the "one account per team" notes mention it)
- Where do developers see status today, and what is the plan: a portal, a CLI, chat?
- How are Compositions tested before they go live?
- Why not a Terraform-based operator or a service catalog instead of Crossplane?
