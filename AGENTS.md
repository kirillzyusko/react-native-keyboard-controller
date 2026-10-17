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

### Bug report evidence

- Try to prepare and verify a minimal runnable reproduction. It may be:
  - A bare React Native project containing only the dependencies, configuration, and code needed to reproduce the bug.
  - A focused fork of this repository with the reproduction added to the corresponding `example/` or `FabricExample/` application.
  - A self-contained snippet that can be pasted into `example/` or `FabricExample/` and reproduces the bug without extra dependencies.
- If you have a reproduction, remove unrelated code and private data, run it from a clean setup, and document the exact steps. In **Reproduction code**, link the project or fork at a specific commit, or include the snippet and where to paste it.
- If a runnable reproduction is unavailable, say why in **Reproduction code**. Include all known symptoms, attempted steps, logs, environment details, and relevant evidence in the report. Put any proposed patch in **Additional context** and label it unverified. Distinguish observed facts from hypotheses.

### Issue preflight

Immediately before creating an issue, verify all of the following:

1. The user explicitly requested issue creation.
2. The issue is not a duplicate.
3. The correct current template was selected.
4. For a bug report, the reproduction is included or linked with exact steps, or its absence is explained and the available evidence is included.
5. Every template section is present and contains real information or an explicit `Not provided` value with an explanation.
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
- For a bug-fix pull request, include runnable reproduction code: a minimal React Native project, a focused example change, a regression test that fails without the fix, or a self-contained snippet that reproduces the bug when pasted into `example/` or `FabricExample/` without extra dependencies.
- Verify the reproduction against the unfixed code, then run the same steps or test with the fix. In the pull request, link to the reproduction at a specific commit, identify the files included in the pull request, or include the snippet and where to paste it. Document setup commands, exact interaction steps, the affected platform and versions, the observed and expected behavior, and the before-and-after results.
- Do not open a bug-fix pull request without a verified runnable reproduction. If it is unavailable, recommend a bug report with the known evidence and any proposed patch in **Additional context**; create the issue only if the user explicitly asks. Do not claim the fix is verified.
- Use Conventional Commit types documented in `CONTRIBUTING.md`: `fix`, `feat`, `refactor`, `docs`, `test`, or `chore`.
- Do not commit, push, open a pull request, publish a release, or create an issue unless the user explicitly asks for that action.
