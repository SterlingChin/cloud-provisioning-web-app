import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool definition for OpenAI function calling
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'provision_infrastructure',
      description: 'Provision or manage cloud infrastructure resources like databases, servers, storage, and networking',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'list', 'delete', 'describe'],
            description: 'The action to perform on the resource',
          },
          resourceType: {
            type: 'string',
            enum: ['database', 'server', 'storage', 'networking'],
            description: 'The type of infrastructure resource',
          },
          resourceName: {
            type: 'string',
            description: 'Name for the resource being created',
          },
          config: {
            type: 'object',
            description: 'Configuration parameters for the resource',
            properties: {
              engine: { type: 'string', description: 'Database engine (postgres, mysql, etc.)' },
              version: { type: 'string', description: 'Version of the database engine' },
              image: { type: 'string', description: 'OS image for server' },
              size: { type: 'string', description: 'Instance size (small, medium, large)' },
              cidrBlock: { type: 'string', description: 'CIDR block for networking' },
            },
          },
        },
        required: ['action', 'resourceType'],
      },
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    const { message, resourceType } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call OpenAI with function calling
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a cloud infrastructure provisioning assistant. Help users create and manage cloud resources like databases, servers, storage, and networking. When users request to create a resource, use the provision_infrastructure function. Be concise and technical in your responses.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = completion.choices[0].message;

    // Check if AI wants to call a function
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // Execute the infrastructure provisioning
      const result = await executeProvisioning(functionArgs);

      return NextResponse.json({
        success: true,
        action: functionArgs.action,
        resourceType: functionArgs.resourceType,
        result: result,
        aiResponse: `I've ${functionArgs.action === 'create' ? 'created' : 'processed'} your ${functionArgs.resourceType}. ${result.message || ''}`,
      });
    }

    // If no function call, return the AI's text response
    return NextResponse.json({
      success: true,
      aiResponse: responseMessage.content,
      noAction: true,
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Execute the actual provisioning via Postman Mock API
async function executeProvisioning(params: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io';

  const { action, resourceType, resourceName, config } = params;

  try {
    if (action === 'create') {
      let endpoint = '';
      let body: any = {};

      switch (resourceType) {
        case 'database':
          endpoint = '/databases';
          body = {
            name: resourceName || `db-${Date.now()}`,
            engine: config?.engine || 'postgres',
            version: config?.version || '14',
          };
          break;

        case 'server':
          endpoint = '/servers';
          body = {
            name: resourceName || `server-${Date.now()}`,
            image: config?.image || 'ubuntu-20.04',
            size: config?.size || 'medium',
          };
          break;

        case 'networking':
          endpoint = '/networking';
          body = {
            name: resourceName || `network-${Date.now()}`,
            cidrBlock: config?.cidrBlock || '10.0.0.0/16',
          };
          break;

        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        resource: data,
        message: `Successfully created ${resourceType}: ${data.name || data.id}`,
      };
    } else if (action === 'list') {
      const endpoints: Record<string, string> = {
        database: '/databases',
        server: '/servers',
        networking: '/networking',
        storage: '/storage',
      };

      const endpoint = endpoints[resourceType];
      const response = await fetch(`${baseUrl}${endpoint}`);
      const data = await response.json();

      return {
        success: true,
        resources: data,
        message: `Found ${Array.isArray(data) ? data.length : 0} ${resourceType}(s)`,
      };
    }

    return {
      success: false,
      message: `Action ${action} not yet implemented`,
    };
  } catch (error: any) {
    console.error('Provisioning Error:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to ${action} ${resourceType}`,
    };
  }
}
