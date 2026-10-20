const ArtifactPathBuilder = require("./artifactPathBuilder");

it("keeps formatted test names out of Android shell substitutions", () => {
  const builder = new ArtifactPathBuilder({ rootDir: "artifacts" });
  const path = builder.buildPathForTestArtifact("testFnFailure.png", {
    fullName: "`KeyboardToolbar` should handle $(text)",
    invocations: 1,
    status: "failed",
  });

  expect(path).toBe(
    "artifacts/✗ KeyboardToolbar should handle (text)/testFnFailure.png",
  );
});
