// app/api/clients/tokenworks/tasks/route.ts
import { NextResponse } from 'next/server';
import { LinearClient } from '@linear/sdk';
import { linearClient } from '@/lib/linear';

const TOKENWORKS_TEAM_ID = process.env.LINEAR_TOKENWORKS_TEAM_ID;

// Define types that match Linear's expected structure
type Variables = {
  input: {
    teamId: string;
    title: string;
    description?: string;
    priority: number;
  }
};

type IssueResponse = {
  issueCreate: {
    success: boolean;
    issue: {
      id: string;
      identifier: string;
      title: string;
      priority: number;
      url: string;
    }
  }
};

export async function POST(request: Request) {
  try {
    const { title, description, priority } = await request.json();

    if (!TOKENWORKS_TEAM_ID) {
      throw new Error('LINEAR_TOKENWORKS_TEAM_ID is not configured');
    }

    const mutation = `
      mutation IssueCreate($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            priority
            url
          }
        }
      }
    `;

    const variables: Variables = {
      input: {
        teamId: TOKENWORKS_TEAM_ID,
        title,
        description,
        priority: Number(priority)
      }
    };

    const response = await linearClient.client.rawRequest<IssueResponse, Variables>(
      mutation,
      variables
    );

    if (!response?.data?.issueCreate) {
      throw new Error('No response data received from Linear');
    }

    const { issueCreate } = response.data;

    if (!issueCreate.success || !issueCreate.issue) {
      throw new Error('Failed to create issue in Linear');
    }

    return NextResponse.json({
      success: true,
      issue: {
        id: issueCreate.issue.id,
        identifier: issueCreate.issue.identifier,
        title: issueCreate.issue.title,
        priority: issueCreate.issue.priority,
        url: issueCreate.issue.url
      }
    });

  } catch (error) {
    console.error('Error creating Linear task:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create task',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}