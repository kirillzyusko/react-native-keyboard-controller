# Security Policy

## Supported Versions

Only the latest minor release of `react-native-keyboard-controller` receives security fixes. Older versions will not be patched — please upgrade to the latest release before reporting.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue, discussion, or pull request for security problems.

Instead, report vulnerabilities privately through GitHub's [Private Vulnerability Reporting](https://github.com/kirillzyusko/react-native-keyboard-controller/security/advisories/new). This keeps the report confidential until a fix is available and credits you in the resulting advisory.

When reporting, please include:

- A description of the issue and its impact
- Steps to reproduce (minimal repro, affected platform — iOS / Android / Web)
- Affected version(s)
- Any suggested mitigation, if known

## Response Process

- **Acknowledgement:** within 48 hours of report
- **Initial assessment:** within 7 days
- **Fix target:** within 90 days for confirmed vulnerabilities, sooner for high-severity issues
- **Disclosure:** coordinated via a GitHub Security Advisory once a patched release is available

## Scope

In scope:

- The library source under `src/`, `android/`, `ios/`, and the published npm package

Out of scope:

- The example applications (`example/`, `FabricExample/`) — these exist only for local development and integration testing
- Issues in third-party dependencies (please report those upstream)
- Vulnerabilities requiring a physically compromised device or a modified host application
