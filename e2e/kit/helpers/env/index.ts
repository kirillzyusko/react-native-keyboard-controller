const softCheck = process.env.SOFT_CHECK === "true";
const Env = {
  /**
   * Can be used to skip pixel-perfect checks and use alternative checks
   * because sometimes it's hard to assure pixel perfect match
   */
  softCheck,
};

export { Env };
