// app/api/linear/teams/route.ts
import { NextResponse } from 'next/server';
import { linearClient } from '@/lib/linear';

export async function GET() {
  try {
    const { nodes: teams } = await linearClient.teams();
    
    return NextResponse.json({
      teams: teams.map(team => ({
        id: team.id,
        name: team.name
      }))
    });
  } catch (error) {
    console.error('Error fetching Linear teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}