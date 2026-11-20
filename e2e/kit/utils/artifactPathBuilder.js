const ArtifactPathBuilder = require("detox/src/artifacts/utils/ArtifactPathBuilder");

module.exports = class SafeArtifactPathBuilder extends ArtifactPathBuilder {
  buildPathForTestArtifact(artifactName, testSummary) {
    return super.buildPathForTestArtifact(
      artifactName,
      testSummary && {
        ...testSummary,
        // Detox interpolates Android artifact paths into double-quoted shell commands.
        fullName: testSummary.fullName.replace(/[`$]/g, ""),
      },
    );
  }
};
