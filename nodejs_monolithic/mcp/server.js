// mcp/server.js
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { ListToolsRequestSchema, CallToolRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

// 1. Import the Registry (The Dispatcher)
const registry = require('./registry/toolRegistry');

// 2. Import Context Providers
const { gitTools, gitHandler } = require('./providers/gitProvider');
const { logTools, logHandler } = require('./providers/logProvider');
const { swaggerTools, swaggerHandler } = require('./providers/swaggerProvider'); 
const { sourceCodeTools, sourceCodeHandler } = require('./providers/sourceCodeProvider');

// 3. Register Providers into the Registry
registry.registerProvider(gitTools, gitHandler);
registry.registerProvider(logTools, logHandler);
registry.registerProvider(swaggerTools, swaggerHandler);
registry.registerProvider(sourceCodeTools, sourceCodeHandler);

// 4. Initialize the MCP Server
const mcpServer = new Server({
    name: "Engineering-Intelligence-MCP",
    version: "1.0.0"
}, {
    capabilities: { tools: {} }
});

// 5. Handle Tool Discovery (What can this server do?)
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: registry.getAllTools() };
});

// 6. Handle Tool Execution (Run the requested tool)
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        return await registry.executeTool(request.params.name, request.params.arguments);
    } catch (error) {
        return { 
            content: [{ type: "text", text: `Error executing tool: ${error.message}` }], 
            isError: true 
        };
    }
});

// 7. Start the Server over Standard I/O (Terminal Pipes)
async function startServer() {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    
    // SDE2 Rule: Always use console.error for logging in stdio MCP servers!
    console.error("🚀 Engineering Intelligence MCP Server running via stdio"); 
}


startServer().catch(err => {
    console.error("Fatal server error:", err);
    process.exit(1);
});