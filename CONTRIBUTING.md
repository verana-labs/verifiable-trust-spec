# Contributing to the Verifiable Trust specification

This file records how the draft specification ([spec.md](spec.md)) is written
and checked. Follow it for every change, so that reviews deal with content and
not with form.

## Before you push

Run the checks:

```
npm install
npm run check
```

`npm run check` builds the HTML and then runs
[scripts/check-spec.mjs](scripts/check-spec.mjs). The script fails when:

- an internal link points to an anchor that does not exist;
- a link to the [VPR specification](https://verana-labs.github.io/verifiable-trust-vpr-spec/)
  points to an anchor that does not exist there;
- the glossary is not in alphabetical order, defines a term twice, lacks a
  definition for a referenced term, or defines a term that nothing references;
- the text cites a rule id, such as `[TR-4]`, that neither specification
  defines;
- a Mermaid diagram does not parse.

The links to the VPR specification are checked only when that repository is
cloned next to this one, as `../verifiable-trust-vpr-spec`, and built there.
Do that whenever a change touches either specification: most rules here point
to VPR sections, and a renamed VPR heading breaks those links without any
build error.

The build prints `Dangling Definitions: ['verifier']`. That line comes from the
frozen `versions/v3` and `versions/v4` copies, not from the draft. The check
script reports on the draft only.

## Writing rules

### Normative and non-normative text

- A requirement appears once, in a normative section, under a rule id.
- Non-normative text (overviews, notes, examples, sections marked
  *non-normative*) names the concept and cites the rule id. It does not use
  MUST, SHOULD or MAY, does not explain the values of an enumeration, and does
  not state conformance levels. If an overview needs a requirement to make
  sense, link to the rule instead of restating it.
- A rule that depends on the registry cites the VPR section by link. It does
  not copy the VPR text.

### Glossary

- An entry says what the term means, in one or two sentences, with at most one
  link. Rules, lists of values and procedures belong in the normative sections.
- Entries are in alphabetical order.
- Every entry is referenced at least once with `[[ref: term]]`. Remove an entry
  when its last reference goes.
- A term has one spelling. Add an alias to the `[[def: term, alias]]` line only
  when the text needs it.

### Rule ids

- A rule id is defined once: in a heading, or at the start of a list item.

### Vocabulary

Use the terms of the glossary. In particular:

| Write | Do not write |
| --- | --- |
| a participant that holds a grantor accreditation | ecosystem operator |
| accreditation, accreditation entry | permission, or participant as the name of the entry |
| onboarding process | validation process |
| exclusion, excluded | blacklist, blacklisted |
| credential exchange, exchange record | session (except a DIDComm session and the mdoc session transcript) |
| trust resolution reads the registry through an indexer | queries the registry API in real time |
| trusted channel (the connection), trusted channel endpoint (the DID Document service entry) | one term for both |
| VS Agent | any other spelling |

`PERMISSIONLESS` and `OPEN` are different values. Under `PERMISSIONLESS` a
holder needs no entry in the registry. Under `OPEN` a participant creates its
own entry.

### Diagrams

- A semicolon inside a Mermaid message or note ends the statement, and the
  diagram then renders as "Syntax error in text" on the published page. Use a
  comma.
- The build does not parse Mermaid: `npm run check` does.

### Scope of this specification

- The protocol of [VT-PROTO] is abstract. Bindings to a trusted channel
  protocol are published separately: do not add binding files or message type
  URIs here.
- Names of fields, messages and enumeration values of the registry come from
  the VPR specification. When the VPR renames one, rename it here in the same
  round.

## Commits and pull requests

- One change per commit.
- Do not name customers or prospects in commits, pull requests or issues.
  Describe the role instead.
- The description of the pull request that carries a new version is a summary,
  by theme, of the differences from the previous version. It is not a commit
  log. When a change lands, edit the bullet it affects.
- A pull request that changes a frozen version needs a review from an owner of
  that path. See [README.md](README.md).
