# Verifiable Trust Protocol: DIDComm v2 binding

**Status:** draft, for the Verifiable Trust Specification v5 ([VT spec](../../)).

This document binds the Verifiable Trust Protocol ([VT-PROTO](../../#vt-proto-verifiable-trust-protocol)) to [DIDComm Messaging](https://identity.foundation/didcomm-messaging/spec/) v2 (2.x), one of the trusted channel protocols of [VT-CHAN-2](../../#vt-chan-trusted-channels). It specifies what [VT-BIND-1](../../#vt-bind-bindings) requires of a binding. The rule identifiers below refer to the VT spec; the VT spec prevails where the two differ.

## Rules

- [VT-BIND-DIDCOMM2-1] **Service and channel.** A `DIDCommMessaging` service entry, its `serviceEndpoint` an object with `uri` and `accept: ["didcomm/v2"]`. A party opens a channel with authenticated-encrypted messages to the DID of its peer, whose key agreement keys it resolves from the DID Document, or by accepting an out-of-band invitation whose `from` is that DID; a [VS](../../#term:verifiable-service) is the party under its DID ([VT-CHAN-3]), and a party without a resolvable DID uses a `did:peer` DID it controls.
- [VT-BIND-DIDCOMM2-2] **Messages.** The protocol identifier is `https://didcomm.org/vt-protocol/5.0`. A message of [VT-PROTO] that the next rules do not map is a DIDComm v2 message whose `type` is that identifier followed by `/` and the message name, whose `body` is a JSON object with the fields of [VT-PROTO] under the same names, and whose `thid` is the `id` of the first message of the exchange. The [message types](#message-types) table gives the type of every message.
- [VT-BIND-DIDCOMM2-3] **Issuance.** [Issue Credential 3.0](https://didcomm.org/issue-credential/3.0/): `offer` is `offer-credential`, `credential-request` is `request-credential` with `exchange_id` in its `body`, `credential` is `issue-credential`. Attachment formats: `anoncreds/credential-offer@v1.0`, `anoncreds/credential-request@v1.0` and `anoncreds/credential@v1.0` for [VT-CRED-ANON]; `aries/ld-proof-vc-detail@v1.0` and `aries/ld-proof-vc@v1.0` for [VT-CRED-W3C].
- [VT-BIND-DIDCOMM2-4] **Presentation.** [Present Proof 3.0](https://didcomm.org/present-proof/3.0/): `presentation-request` is `request-presentation`, `presentation` is `presentation`, in a thread whose `pthid` is the `request`'s. Attachment formats: `anoncreds/proof-request@v1.0` and `anoncreds/proof@v1.0` for [VT-CRED-ANON]; `dif/presentation-exchange/definitions@v1.0` and `dif/presentation-exchange/submission@v1.0` for [VT-CRED-W3C].
- [VT-BIND-DIDCOMM2-5] **Errors.** `error` is a DIDComm v2 [problem report](https://identity.foundation/didcomm-messaging/spec/#problem-reports) whose code carries the code of [VT-PROTO-4].

## Message types

| [VT-PROTO] message | Message type |
| --- | --- |
| `request` | `https://didcomm.org/vt-protocol/5.0/request` |
| `answer` | `https://didcomm.org/vt-protocol/5.0/answer` |
| `next` | `https://didcomm.org/vt-protocol/5.0/next` |
| `presentation-request` | `https://didcomm.org/present-proof/3.0/request-presentation` |
| `presentation-digest` | `https://didcomm.org/vt-protocol/5.0/presentation-digest` |
| `presentation` | `https://didcomm.org/present-proof/3.0/presentation` |
| `exchange-recorded` | `https://didcomm.org/vt-protocol/5.0/exchange-recorded` |
| `error` | `https://didcomm.org/report-problem/2.0/problem-report` |
| `onboarding-request` | `https://didcomm.org/vt-protocol/5.0/onboarding-request` |
| `information-request` | `https://didcomm.org/vt-protocol/5.0/information-request` |
| `information` | `https://didcomm.org/vt-protocol/5.0/information` |
| `validating` | `https://didcomm.org/vt-protocol/5.0/validating` |
| `onboarding-result` | `https://didcomm.org/vt-protocol/5.0/onboarding-result` |
| `withdraw` | `https://didcomm.org/vt-protocol/5.0/withdraw` |
| `issuance-request` | `https://didcomm.org/vt-protocol/5.0/issuance-request` |
| `offer` | `https://didcomm.org/issue-credential/3.0/offer-credential` |
| `credential-request` | `https://didcomm.org/issue-credential/3.0/request-credential` |
| `credential` | `https://didcomm.org/issue-credential/3.0/issue-credential` |
| `credential-state` | `https://didcomm.org/vt-protocol/5.0/credential-state` |
| `accreditation-state` | `https://didcomm.org/vt-protocol/5.0/accreditation-state` |
| `service-state` | `https://didcomm.org/vt-protocol/5.0/service-state` |
