import { checkLaunchConfig } from "./launch-readiness.mjs";
const args = process.argv.slice(2);
if (args.some((a) => !["--production", "--json", "--help"].includes(a))) {
  console.error("Usage: npm run launch:check -- [--production] [--json]");
  process.exitCode = 2;
} else if (args.includes("--help"))
  console.log(
    "Offline configuration check; no activation or launch approval. Reads process environment only. For a local env file use: node --env-file=.env.local scripts/check-launch-config.mjs [--production]. Never paste keys into chat.",
  );
else {
  const report = checkLaunchConfig(process.env, {
    production: args.includes("--production"),
  });
  if (args.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(
      `Growthly ${report.mode} configuration check — NOT a launch approval`,
    );
    console.log(
      "Reads process environment only; run with the same environment as the intended build/runtime.",
    );
    for (const c of report.checks)
      console.log(`[${c.status.toUpperCase()}] ${c.id}: ${c.message}`);
    console.log("\nStill requires real acceptance:");
    for (const item of report.manualGates) console.log(`- ${item}`);
    console.log(
      report.configurationOK
        ? "\nConfiguration checks passed for this mode; launch approval is still pending."
        : "\nConfiguration checks blocked. No settings were changed.",
    );
  }
  process.exitCode = report.configurationOK ? 0 : 1;
}
