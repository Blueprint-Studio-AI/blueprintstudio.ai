// lib/linear.ts
import { LinearClient } from "@linear/sdk";

if (!process.env.LINEAR_API_KEY) {
  throw new Error("LINEAR_API_KEY is not defined");
}

export const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
});