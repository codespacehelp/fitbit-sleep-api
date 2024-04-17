import "dotenv/config";
import fs from "fs";
import { randomBytes, createHash } from "crypto";
import readline from "readline";

const clientId = process.env.FITBIT_CLIENT_ID;
const clientSecret = process.env.FITBIT_CLIENT_SECRET;
const scope = "sleep+temperature+heartrate+respiratory_rate+oxygen_saturation";
const responseType = "code";
if (!clientId || !clientSecret) {
  console.error(
    "FITBIT_CLIENT_ID and FITBIT_CLIENT_SECRET environment variables are required. Please specify them in a .env file."
  );
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
      rl.close(); // Close the readline interface after receiving input
    });
  });
}

// Generate a code verifier
function generateCodeVerifier(length = 128) {
  return randomBytes(length).toString("hex").substring(0, length);
}

// Generate a code challenge from the code verifier
function generateCodeChallenge(codeVerifier) {
  const hash = createHash("sha256").update(codeVerifier).digest("base64");
  // Base64url encoding
  return hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Main flow
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

// prettier-ignore
const authorizationUrl = `https://www.fitbit.com/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

console.log("Code Verifier:", codeVerifier);
console.log("Code Challenge:", codeChallenge);
console.log("Authorization URL:", authorizationUrl);

console.log("Now click the authorization URL and login.");
console.log("Paste in the resulting URL of the profile, then press enter:");

// Example URL: https://www.fitbit.com/user/BY6RQX#code=3e4f5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H
const responseUrl = await question("Paste URL: ");
const url = new URL(responseUrl);
const authorizationCode = url.searchParams.get("code");
console.log("Authorization Code:", authorizationCode);

const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

let parameters = "";
parameters += `client_id=${clientId}`;
parameters += `&code=${authorizationCode}`;
parameters += `&code_verifier=${codeVerifier}`;
parameters += `&grant_type=authorization_code`;

// Request (POST https://api.fitbit.com/oauth2/token)
const res = await fetch("https://api.fitbit.com/oauth2/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${base64Credentials}==`,
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  },
  body: parameters,
});
const json = await res.json();
console.log(json);
// Store json.access_token in a .access_token file.
fs.writeFileSync(".access_token", json.access_token, "utf8");
