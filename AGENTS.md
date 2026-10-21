# Repository instructions for agents

These instructions apply to the entire repository. Follow direct user or maintainer instructions when they are more specific.

- Preserve the existing issue template structure and the pull request template's top-level headings and order. Within pull request bodies, remove unaffected Changelog subsections, add subsections for affected areas such as Docs or E2E, and use `###` case headings within Screenshots as described below. Do not modify template files unless explicitly requested.

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

- For every bug report or bug-fix request, check whether a runnable reproduction is provided. If it is missing, explicitly ask the reporter for one. If it is already provided, use and verify it instead of requesting it again.
- Request a minimal runnable project, a focused example change, or a self-contained snippet with the exact target file, setup commands, and interaction steps.
- Try to prepare and verify a minimal runnable reproduction. It may be:
  - A bare React Native project containing only the dependencies, configuration, and code needed to reproduce the bug.
  - A focused fork of this repository with the reproduction added to the corresponding `example/` or `FabricExample/` application.
  - A self-contained snippet that can be pasted into `example/` or `FabricExample/` and reproduces the bug without extra dependencies.
- If you have a reproduction, remove unrelated code and private data, run it from a clean setup, and document the exact steps. Put snippets and their target files in **Code snippet**, repository links and the relevant branch or commit in **Repo for reproducing**, and setup commands and interaction steps in **To Reproduce**.
- If a runnable reproduction is unavailable, say why in **Repo for reproducing**. Include all known symptoms, attempted steps, logs, environment details, and relevant evidence in the report. Put any proposed patch in **Additional context** and label it unverified. Distinguish observed facts from hypotheses.

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

- Follow `.github/PULL_REQUEST_TEMPLATE.md` when preparing a pull request. If its instructional comments conflict with the section responsibilities below, follow these rules while preserving the top-level headings and order.
- Keep pull requests small and focused.
- Write in the maintainer's concise, direct style: use concrete facts, explain the problem in enough detail to understand it, and omit filler, generic claims, repeated summaries, and AI boilerplate. Use these PR descriptions as style references; the current rules below govern section contents:
  - [#1304](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/1304)
  - [#1047](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/1047)
  - [#1016](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/1016)
  - [#257](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/257)
- In **📜 Description**, summarize the PR's idea and resulting behavior in one or two sentences. Put reproduction steps, implementation reasoning, and alternatives in **💡 Motivation and Context**.
- In **💡 Motivation and Context**, describe the exact steps that trigger the bug, the observed and expected behavior, why the chosen solution addresses it, and which alternatives were considered and why they did not fit. Include only alternatives actually considered; do not invent a comparison to fill the section. Link the issues and PRs this change fixes, closes, or supersedes, using `Fixes` or `Closes` where appropriate and explaining related PRs' relevance.
- For a bug-fix pull request, include runnable reproduction code: a minimal React Native project, a focused example change, a regression test that fails without the fix, or a self-contained snippet that reproduces the bug when pasted into `example/` or `FabricExample/` without extra dependencies.
- Verify the reproduction against the unfixed code, then run the same steps or test with the fix. In **💡 Motivation and Context**, link to the reproduction at a specific commit, identify the reproduction files included in the pull request, or include the snippet and where to paste it. Document setup commands, exact interaction steps, the affected platform and versions, the observed and expected behavior, and the before-and-after results there.
- In **📢 Changelog**, briefly describe changes by file: name the affected files and what was added, moved, or fixed. Group related files when that keeps the list concise. Keep only affected platform or language subsections (`JS`, `iOS`, `Android`); remove unaffected ones instead of writing "No changes". Add appropriate subsections such as `Docs` or `E2E` when those areas change. Remove empty placeholder bullets.
- In **🤔 How Has This Been Tested?**, include only a list of device models, their OS versions, and whether verification was performed manually or by an agent, using the format `Device model (OS version/manual or agent)`. Identify simulators or emulators as such. Do not list unit-test, lint, type-check, or other CI results; CI reports those checks. If no device verification was performed, state that and explain why.
- Always attach before-and-after screenshots from the verification listed above in **📸 Screenshots (if appropriate):** as visual confirmation of the changes. Use the same scenario and device for both, and label each attachment with before/after, the device model, and OS version. Recordings may supplement the screenshots and must also show before and after.
- Prefer side-by-side `Before` / `After` tables for screenshots and recordings. For videos, use this format with real attachment URLs:

  ```markdown
  | Before                                      | After                                      |
  | ------------------------------------------- | ------------------------------------------ |
  | <video src="BEFORE_ATTACHMENT_URL"></video> | <video src="AFTER_ATTACHMENT_URL"></video> |
  ```

- When comparing multiple cases, add a descriptive `###` heading and a separate before-and-after table for each case within Screenshots. Cover each issue fixed, distinct interactions, and relevant existing behavior that should remain unchanged; include before-and-after evidence for those unchanged cases too.
- For optimizations, also attach profiler sessions from before and after the change in **📸 Screenshots (if appropriate):**, captured using the same workload, device, and profiling configuration.
- In **📝 Checklist**, preserve the template's existing items, wording, and order. Only mark existing checkboxes as complete when supported by evidence; leave pending items unchecked. Do not rewrite, remove, or add checklist items or append explanations to them.
- Do not open a bug-fix pull request without a verified runnable reproduction. If it is unavailable, recommend a bug report with the known evidence and any proposed patch in **Additional context**; create the issue only if the user explicitly asks. Do not claim the fix is verified.
- Use Conventional Commit types documented in `CONTRIBUTING.md`: `fix`, `feat`, `refactor`, `docs`, `test`, or `chore`.
- Do not commit, push, open a pull request, publish a release, or create an issue unless the user explicitly asks for that action.
