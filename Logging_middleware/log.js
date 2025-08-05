const fetch = require("node-fetch");

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = {
  backend: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"],
  frontend: ["api"],
  both: ["component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"]
};

async function Log(stack, level, pkg, message) {
  // Validate stack
  if (!validStacks.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return;
  }

  // Validate level
  if (!validLevels.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return;
  }

  // Validate package
  const allowedPackages = [...validPackages.both, ...(validPackages[stack] || [])];
  if (!allowedPackages.includes(pkg)) {
    console.error(`Invalid package '${pkg}' for stack '${stack}'`);
    return;
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const res = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`Failed to log: ${res.status} - ${await res.text()}`);
    } else {
      const data = await res.json();
      console.log("✅ Log success:", data.logID);
    }
  } catch (error) {
    console.error("❌ Error sending log:", error);
  }
}

module.exports = Log;