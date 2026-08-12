# Repository instructions for agents

These instructions apply to the entire repository. Follow direct user or maintainer instructions when they are more specific.

## GitHub issues

- Create a GitHub issue only when the user explicitly asks for one. Diagnosing a problem, discussing a feature, or drafting an issue does not authorize publishing it.
- Never create a blank issue or use an ad-hoc issue body. Every new issue must use one of the repository templates:
  - Bugs: `.github/ISSUE_TEMPLATE/bug_report.md`
  - Feature requests: `.github/ISSUE_TEMPLATE/feature_request.md`
- Read the selected template immediately before drafting or creating the issue so the current version is used.
- Preserve every heading and requested section from the template, in the same order. Replace the instructional text with concrete information; do not submit template prompts or empty sections.
- If requested information is unavailable, write `Not provided` and briefly identify what is missing instead of deleting the section or guessing.
- Apply the labels and assignee declared in the template front matter. When using the GitHub CLI, prefer `gh issue create --template bug_report.md` or `gh issue create --template feature_request.md`; if a non-interactive body file is required, it must reproduce the selected template exactly and the metadata must be supplied explicitly.
- Before submission, search for an existing issue that covers the same problem or request. Do not create a duplicate; report the likely duplicate to the user instead.
- Do not create an issue if it does not fit an existing template. Ask the user or maintainer whether a new template should be added or which existing template to use.

### Bug report reproduction requirement

- Before creating a bug report, prepare and verify a minimal reproduction. A code snippet alone is not a reproduction.
- Use one of these forms:
  - A bare React Native project containing only the dependencies, configuration, and code needed to reproduce the bug.
  - A focused fork of this repository with the reproduction added to the corresponding `example/` or `FabricExample/` application.
- Remove unrelated application code, screens, dependencies, credentials, and private data. Keep the reproduction as small as possible while preserving the failure.
- Run the reproduction from a clean setup and confirm that the documented steps reliably demonstrate the reported behavior.
- In the bug template's **Repo for reproducing** section, provide the reproduction location and identify the relevant branch or commit. In **To Reproduce**, include the exact commands and interaction steps required to observe the bug.
- If a working minimal reproduction cannot be prepared or shared, do not create the bug report. Explain the blocker to the user instead.

### Issue preflight

Immediately before creating an issue, verify all of the following:

1. The user explicitly requested issue creation.
2. The issue is not a duplicate.
3. The correct current template was selected.
4. For a bug report, a working minimal reproduction has been verified and linked with exact reproduction steps.
5. Every template section is present and contains real information or an explicit `Not provided` value, except that a bug reproduction is mandatory and cannot be `Not provided`.
6. Template labels and assignee are included.

If any check fails, do not create the issue.

## Repository layout

- `src/`: TypeScript and React Native public API, components, hooks, specs, and unit tests.
- `ios/`: iOS implementation in Swift and Objective-C/Objective-C++.
- `android/`: Android implementation in Kotlin and JNI/C++.
- `common/` and `cpp/`: shared New Architecture C++ code.
- `example/` and `FabricExample/`: example applications used to exercise library changes.
- `e2e/`: end-to-end test flows and test helpers.
- `docs/`: documentation site.

## Development workflow

- Use Yarn 1; do not switch package managers or regenerate lockfiles unnecessarily.
- Inspect the relevant implementation and nearby tests before making a change. Keep edits focused and preserve unrelated worktree changes.
- Do not edit generated build output in `lib/`; edit sources under `src/` and rebuild when necessary.
- Add or update focused tests for behavior changes when practical.
- Follow the existing style and formatting configuration. Avoid unrelated formatting churn.

Run the checks relevant to the changed surface:

```sh
yarn typescript
yarn lint
yarn test
```

For native or example-app changes, also run the narrowest applicable platform build or test. If a required check cannot be run, state that clearly in the handoff.

## Pull requests and commits

- Follow `.github/PULL_REQUEST_TEMPLATE.md` and retain all applicable sections when preparing a pull request.
- Keep pull requests small and focused. Describe how the change was tested and include screenshots or recordings for visible UI changes when appropriate.
- Use Conventional Commit types documented in `CONTRIBUTING.md`: `fix`, `feat`, `refactor`, `docs`, `test`, or `chore`.
- Do not commit, push, open a pull request, publish a release, or create an issue unless the user explicitly asks for that action.
