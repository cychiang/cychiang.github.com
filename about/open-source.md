---
title: Open source
order: 3
---

### My projects

- [xp-provider-gen](https://github.com/cychiang/xp-provider-gen): a
  Kubebuilder plugin that creates and updates the project structure and
  APIs of a Crossplane provider.

### Contributions

- [crossplane/provider-template](https://github.com/crossplane/provider-template):
  the starting point for custom Crossplane providers. Moved it from
  cluster-scoped to namespaced resources, added typed external connectors
  and changelogs, and keep its dependencies and documentation current.
- [crossplane/upjet-provider-template](https://github.com/crossplane/upjet-provider-template):
  the starting point for providers converted from Terraform providers.
  Updated dependencies and enabled metrics.
- [crossplane/crossplane](https://github.com/crossplane/crossplane): in the
  command line tool, passing credentials to functions in `render`, pulling
  images from private registries, and reading the Podman configuration.
- [crossplane-contrib](https://github.com/crossplane-contrib): fixed a
  memory leak in provider-argocd, added Container Apps and Service Bus
  resources to the Azure provider, and fixed vulnerabilities in
  provider-helm.
- Smaller changes to
  [configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials),
  [CloudQuery](https://github.com/cloudquery/cloudquery) and
  [Apache Superset](https://github.com/apache/superset).

[All merged pull requests on GitHub](https://github.com/search?q=author%3Acychiang+type%3Apr+is%3Amerged+-user%3Acychiang&type=pullrequests)
