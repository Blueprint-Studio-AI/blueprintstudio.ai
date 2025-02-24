// scripts/get-linear-teams.ts
import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

async function getTeams() {
  const linearClient = new LinearClient({
    apiKey: "x"
  });

  const { nodes: teams } = await linearClient.teams();
  
  console.log('Available Teams:');
  teams.forEach(team => {
    console.log(`Name: ${team.name}`);
    console.log(`ID: ${team.id}`);
    console.log('---');
  });
}

getTeams().catch(console.error);