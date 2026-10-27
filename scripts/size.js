const { exec } = require("child_process");

exec(
  "npm pack --json --foreground-scripts=false",
  function (error, stdout, stderr) {
    console.log(JSON.parse(stdout)[0].size);
  },
);
