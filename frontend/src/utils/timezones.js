// Minimal curated timezone entries grouped by UTC offset.
// Each entry includes a label (UTC offset), an abbreviation/name, example regions,
// and a short list of representative IANA zone identifiers to present to users.
const timezones = [
  {
    label: "UTC+02:00",
    abbr: "EET / IST",
    examples: "Israel, Jordan, Lebanon",
    zones: [
      "Asia/Jerusalem",
      "Asia/Amman",
      "Asia/Beirut",
      "Europe/Athens",
      "Europe/Bucharest",
    ],
  },
  {
    label: "UTC+03:00",
    abbr: "AST / MSK",
    examples: "Saudi Arabia, Iraq, Qatar, European Russia",
    zones: ["Europe/Moscow", "Asia/Riyadh", "Asia/Baghdad", "Asia/Qatar"],
  },
  {
    label: "UTC+03:30",
    abbr: "IRST",
    examples: "Iran",
    zones: ["Asia/Tehran"],
  },
  {
    label: "UTC+04:00",
    abbr: "AZT / GET",
    examples: "Armenia, Azerbaijan, Georgia, UAE",
    zones: ["Asia/Yerevan", "Asia/Baku", "Asia/Tbilisi", "Asia/Dubai"],
  },
  {
    label: "UTC+04:30",
    abbr: "AFT",
    examples: "Afghanistan",
    zones: ["Asia/Kabul"],
  },
  {
    label: "UTC+05:00",
    abbr: "PKT / MVT",
    examples: "Pakistan, Maldives",
    zones: ["Asia/Karachi", "Indian/Maldives", "Asia/Yekaterinburg"],
  },
  {
    label: "UTC+05:30",
    abbr: "IST",
    examples: "India, Sri Lanka",
    zones: ["Asia/Kolkata", "Asia/Colombo"],
  },
  {
    label: "UTC+05:45",
    abbr: "NPT",
    examples: "Nepal",
    zones: ["Asia/Kathmandu"],
  },
  {
    label: "UTC+06:00",
    abbr: "BST / KGT",
    examples: "Bangladesh, Bhutan, Kyrgyzstan",
    zones: ["Asia/Dhaka", "Asia/Thimphu", "Asia/Bishkek"],
  },
  {
    label: "UTC+06:30",
    abbr: "MMT",
    examples: "Myanmar",
    zones: ["Asia/Yangon"],
  },
  {
    label: "UTC+07:00",
    abbr: "ICT / WIB",
    examples: "Thailand, Vietnam, Laos, Cambodia, Western Indonesia",
    zones: [
      "Asia/Bangkok",
      "Asia/Ho_Chi_Minh",
      "Asia/Vientiane",
      "Asia/Jakarta",
    ],
  },
  {
    label: "UTC+08:00",
    abbr: "CST / SGT / MYT",
    examples: "China, Singapore, Malaysia, Philippines",
    zones: [
      "Asia/Shanghai",
      "Asia/Singapore",
      "Asia/Kuala_Lumpur",
      "Asia/Manila",
    ],
  },
  {
    label: "UTC+09:00",
    abbr: "JST / KST",
    examples: "Japan, North/South Korea, eastern Indonesia",
    zones: ["Asia/Tokyo", "Asia/Seoul"],
  },
  {
    label: "UTC+10:00",
    abbr: "PGT / ChST",
    examples: "Papua New Guinea, Guam, Northern Mariana Islands",
    zones: ["Pacific/Port_Moresby", "Pacific/Guam"],
  },
  {
    label: "UTC+12:00",
    abbr: "ANAT / PETT",
    examples: "Far eastern Russia (e.g., Kamchatka), parts of the Pacific",
    zones: ["Asia/Kamchatka", "Pacific/Fiji", "Pacific/Auckland"],
  },
];

export default timezones;
