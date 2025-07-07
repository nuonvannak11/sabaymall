import crypto from "crypto";

export function encrypt(text: string): string {
  const algorithm = "aes-256-cbc";
  const secretKey = process.env.SECRET_KEY;
  const secretIV = process.env.SECRET_IV;

  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  const hash = crypto
    .createHash("sha256")
    .update(secretKey + secretIV)
    .digest();
  const iv = hash.subarray(0, 16);

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

export function decrypt(encryptedData: string): string {
  try {
    const algorithm = "aes-256-cbc";
    const secretKey = process.env.SECRET_KEY;
    const secretIV = process.env.SECRET_IV;

    if (!secretKey) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }

    const hash = crypto
      .createHash("sha256")
      .update(secretKey + secretIV)
      .digest();
    const iv = hash.subarray(0, 16);

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey),
      iv
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    return "";
  }
}
