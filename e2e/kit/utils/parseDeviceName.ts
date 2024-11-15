const parseDeviceName = (name: string) =>
  name.split("(").pop()?.replace(")", "");

export default parseDeviceName;
