import crypto from "node:crypto";
function md5(str: string) {
  const hash = crypto.createHash("md5");
  return hash.update(str).digest("hex")
}

export default md5;
