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
              region: { type: 'string', description: 'AWS region for storage bucket' },
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

    // Map resource types to friendly names
    const resourceTypeNames: Record<string, string> = {
      database: 'database',
      server: 'server',
      storage: 'S3 storage bucket',
      networking: 'network resource',
    };

    const resourceTypeName = resourceTypeNames[resourceType] || 'resource';

    // Call OpenAI with function calling
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a cloud infrastructure provisioning assistant specialized in creating ${resourceTypeName}s. The user is ONLY requesting to create a ${resourceTypeName}. Use the provision_infrastructure function with resourceType="${resourceType}". Be concise and technical in your responses.`,
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
      if (!('function' in toolCall)) {
        throw new Error('Unexpected tool call type');
      }
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // Validate that the resource type matches what was requested
      if (functionArgs.resourceType !== resourceType) {
        return NextResponse.json({
          success: false,
          error: `Invalid resource type. This page is for provisioning ${resourceTypeName}s only.`,
          aiResponse: `I can only create ${resourceTypeName}s on this page. Please use the correct provisioning page for ${functionArgs.resourceType}s.`,
        }, { status: 400 });
      }

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

        case 'storage':
          // Use Postman Flow endpoint for storage
          endpoint = '';
          body = {
            'bucket-name': resourceName || `bucket-${Date.now()}`,
            region: config?.region || 'us-east-1',
          };
          break;

        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }

      // Use Postman Flow for storage, regular endpoints for others
      let url = '';
      if (resourceType === 'storage') {
        url = 'https://deriv-space-yaml.flows.pstmn.io/api/default/create-and-list-s3-buckets';
      } else {
        url = `${baseUrl}${endpoint}`;
      }

      const response = await fetch(url, {
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

      // Parse Flow response for storage
      if (resourceType === 'storage') {
        const bucketName = body['bucket-name'];
        const isSuccess = data['success-response']?.http?.status === 200;

        if (isSuccess) {
          // Extract list of buckets from Flow response
          const buckets = data['list-buckets'] || [];

          return {
            success: true,
            resource: {
              id: bucketName,
              name: bucketName,
              region: body.region || 'us-east-1',
              status: 'available',
              createdAt: new Date().toISOString(),
              totalBuckets: buckets.length,
            },
            message: `Successfully created ${resourceType}: ${bucketName}`,
          };
        }
      }

      // Regular response for other resource types
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

      // Handle storage list if mock doesn't have it
      if (!response.ok && resourceType === 'storage') {
        console.log('Mock storage list endpoint not available, using empty list');
        return {
          success: true,
          resources: [],
          message: `Found 0 ${resourceType}(s)`,
        };
      }

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
