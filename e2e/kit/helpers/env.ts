console.log(process.env.SOFT_CHECK, process.env);
const softCheck = process.env.SOFT_CHECK === "true";
export { softCheck };
