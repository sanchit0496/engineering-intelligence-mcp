const providers = new Map();
const toolDefinitions = [];

const registerProvider = (tools, handler) => {
    tools.forEach(tool => {
        providers.set(tool.name, handler);
        toolDefinitions.push(tool);
    });
};

const getAllTools = () => toolDefinitions;

const executeTool = async (name, args) => {
    const handler = providers.get(name);
    if (!handler) {
        throw new Error(`Tool not found in registry: ${name}`);
    }
    return await handler(name, args);
};

module.exports = { registerProvider, getAllTools, executeTool };