# verifiable-trust-spec

## About

Specification for adding a trust verification layer to the internet, essential for agentic infrastructures. It proposes a system using verifiable credentials and Verifiable Public Registries (VPRs) to establish secure, zero-trust communication channels. The specification details requirements for verifiable services and user agents, including essential credential schemas for various entities (services, organizations, persons, user agents). It outlines procedures for credential issuance, presentation requests, and trust resolution, aiming to create a more trustworthy and interoperable internet. The specification also addresses aspects like DID Documents and whitelists of trusted VPRs.

Browsable spec (latest draft): [https://verana-labs.github.io/verifiable-trust-spec/](https://verana-labs.github.io/verifiable-trust-spec/)

Latest stable (v4): [https://verana-labs.github.io/verifiable-trust-spec/versions/v4/](https://verana-labs.github.io/verifiable-trust-spec/versions/v4/)

Previous versions: [v3](https://verana-labs.github.io/verifiable-trust-spec/versions/v3/)

## Versions

Each version keeps its markdown source in its own directory:

| Version | Source | Page |
| --- | --- | --- |
| v5 (draft) | [spec.md](spec.md) | `/` |
| v4 (stable) | [versions/v4/spec.md](versions/v4/spec.md) | `/versions/v4/` |
| v3 (frozen) | [versions/v3/spec.md](versions/v3/spec.md) | `/versions/v3/` |

CI renders every version from its source on each deploy, so no page can fall
out of step with its markdown.

[.github/CODEOWNERS](.github/CODEOWNERS) lists the frozen versions. A pull
request that changes a frozen version needs a review from an owner of that
path. To freeze a version, add its directory to that file. To unfreeze a
version, delete its line.

## How to contribute

Clone the repo. Then run `npm install` and `npm run render` to build the HTML.
The render writes one `index.html` for each spec that [specs.json](specs.json) lists.
Git does not track these files. CI builds them again on each deploy.

Contribute by editing [spec.md](spec.md) in a new branch.

To re-render html while you edit the spec.md file, run:

```
npm run dev
```