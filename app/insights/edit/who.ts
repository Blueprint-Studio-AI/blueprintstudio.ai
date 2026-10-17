import { execFileSync } from "node:child_process";

/** Who's editing, for comments and version history: git's user name on this machine. */
export function whoAmI(): string {
  try {
    return execFileSync("git", ["config", "user.name"], { encoding: "utf8" }).trim() || "You";
  } catch {
    return "You";
  }
}
