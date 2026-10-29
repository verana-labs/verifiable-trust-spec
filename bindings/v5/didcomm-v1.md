# Verifiable Trust Protocol: DIDComm v1 binding

**Status:** draft, for the Verifiable Trust Specification v5 ([VT spec](../../)).

This document binds the Verifiable Trust Protocol ([VT-PROTO](../../#vt-proto-verifiable-trust-protocol)) to [DIDComm](https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0005-didcomm) v1, one of the trusted channel protocols of [VT-CHAN-2](../../#vt-chan-trusted-channels). It specifies what [VT-BIND-1](../../#vt-bind-bindings) requires of a binding. The rule identifiers below refer to the VT spec; the VT spec prevails where the two differ.

## Rules

- [VT-BIND-DIDCOMM1-1] **Service and channel.** A `did-communication` service entry, with `serviceEndpoint`, `recipientKeys`, `routingKeys` and `accept: ["didcomm/aip2;env=rfc19"]`. A channel with a [VS](../../#term:verifiable-service) is established with [DID Exchange](https://github.com/hyperledger/aries-rfcs/tree/main/features/0023-did-exchange) using the VS's DID, through an implicit invitation or an out-of-band invitation naming that DID, so that the VS's DID is its party ([VT-CHAN-3]); a party without a resolvable DID uses a `did:peer` DID it controls. Messages are packed with authenticated encryption ([RFC 0019](https://github.com/hyperledger/aries-rfcs/tree/main/features/0019-encryption-envelope)).
- [VT-BIND-DIDCOMM1-2] **Messages.** The protocol identifier is `https://didcomm.org/vt-protocol/5.0`. A message of [VT-PROTO] that the next rules do not map is a DIDComm v1 message whose `@type` is that identifier followed by `/` and the message name, whose fields are top-level properties under the names of [VT-PROTO], and whose `~thread.thid` is the `@id` of the first message of the exchange. The [message types](#message-types) table gives the type of every message.
- [VT-BIND-DIDCOMM1-3] **Issuance.** [Issue Credential 2.0](https://github.com/hyperledger/aries-rfcs/tree/main/features/0453-issue-credential-v2): `offer` is `offer-credential`, `credential-request` is `request-credential`, `credential` is `issue-credential`. Attachment formats: `anoncreds/credential-offer@v1.0`, `anoncreds/credential-request@v1.0` and `anoncreds/credential@v1.0` for [VT-CRED-ANON]; `aries/ld-proof-vc-detail@v1.0` and `aries/ld-proof-vc@v1.0` for [VT-CRED-W3C].
- [VT-BIND-DIDCOMM1-4] **Presentation.** [Present Proof 2.0](https://github.com/hyperledger/aries-rfcs/tree/main/features/0454-present-proof-v2): `presentation-request` is `request-presentation`, `presentation` is `presentation`, in a thread whose `~thread.pthid` is the `request`'s. Attachment formats: `anoncreds/proof-request@v1.0` and `anoncreds/proof@v1.0` for [VT-CRED-ANON]; `dif/presentation-exchange/definitions@v1.0` and `dif/presentation-exchange/submission@v1.0` for [VT-CRED-W3C].
- [VT-BIND-DIDCOMM1-5] **Fields.** In the messages of [VT-BIND-DIDCOMM1-3] and [VT-BIND-DIDCOMM1-4], the fields of [VT-PROTO] that the carrying protocol does not define (`vtjsc`, `issuer_did`, `exchange_required` and `replaces` of `offer`; `exchange_id` of `credential-request`, `credential`, `presentation-request` and `presentation`) are top-level properties of the message under the same names. The `comment` of `offer` is the protocol's own `comment`, and the format-specific offer, credential request, credential, presentation request and presentation are the attachments those rules list.
- [VT-BIND-DIDCOMM1-6] **Errors.** `error` is a [problem report](https://github.com/hyperledger/aries-rfcs/tree/main/features/0035-report-problem) whose `description.code` carries the code of [VT-PROTO-4].

## Message types

| [VT-PROTO] message | Message type |
| --- | --- |
| `request` | `https://didcomm.org/vt-protocol/5.0/request` |
| `answer` | `https://didcomm.org/vt-protocol/5.0/answer` |
| `next` | `https://didcomm.org/vt-protocol/5.0/next` |
| `presentation-request` | `https://didcomm.org/present-proof/2.0/request-presentation` |
| `presentation-digest` | `https://didcomm.org/vt-protocol/5.0/presentation-digest` |
| `presentation` | `https://didcomm.org/present-proof/2.0/presentation` |
| `exchange-recorded` | `https://didcomm.org/vt-protocol/5.0/exchange-recorded` |
| `error` | `https://didcomm.org/report-problem/1.0/problem-report` |
| `onboarding-request` | `https://didcomm.org/vt-protocol/5.0/onboarding-request` |
| `information-request` | `https://didcomm.org/vt-protocol/5.0/information-request` |
| `information` | `https://didcomm.org/vt-protocol/5.0/information` |
| `validating` | `https://didcomm.org/vt-protocol/5.0/validating` |
| `onboarding-result` | `https://didcomm.org/vt-protocol/5.0/onboarding-result` |
| `withdraw` | `https://didcomm.org/vt-protocol/5.0/withdraw` |
| `issuance-request` | `https://didcomm.org/vt-protocol/5.0/issuance-request` |
| `offer` | `https://didcomm.org/issue-credential/2.0/offer-credential` |
| `credential-request` | `https://didcomm.org/issue-credential/2.0/request-credential` |
| `credential` | `https://didcomm.org/issue-credential/2.0/issue-credential` |
| `credential-state` | `https://didcomm.org/vt-protocol/5.0/credential-state` |
| `accreditation-state` | `https://didcomm.org/vt-protocol/5.0/accreditation-state` |
| `service-state` | `https://didcomm.org/vt-protocol/5.0/service-state` |
