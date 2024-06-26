import fs from "fs";
const accessToken = fs.readFileSync(".access_token", "utf8");

// Check if the user has provided an argument
if (process.argv.length < 3) {
  console.error(
    "Please provide a date in the format YYYY-MM-DD, e.g. node get-sleep-data.js 2024-02-27"
  );
  process.exit(1);
}
const date = process.argv[2];

// Sleep Data (GET https://api.fitbit.com/1.2/user/BY6RQX/sleep/date/2024-02-27.json)
const res = await fetch(
  `https://api.fitbit.com/1/user/-/hrv/date/${date}/all.json`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
const json = await res.json();

if (!fs.existsSync("hrv_data")) {
  fs.mkdirSync("hrv_data");
}

// Store the sleep data in a sleep-2024-02-27.json file
fs.writeFileSync(
  `hrv_data/hrv-${date}.json`,
  JSON.stringify(json, null, 2),
  "utf8"
);
