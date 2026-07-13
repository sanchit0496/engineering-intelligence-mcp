const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../');

// Security Check: Prevents Path Traversal Attacks (e.g., ../../../etc/passwd)
const getSecurePath = (requestedPath) => {
    const absolutePath = path.resolve(PROJECT_ROOT, requestedPath);
    if (!absolutePath.startsWith(PROJECT_ROOT)) {
        throw new Error("Security Violation: Cannot access files outside the project root.");
    }
    return absolutePath;
};

// Tool Registry Definitions
const sourceCodeTools = [
    {
        name: "list_directory",
        description: "Lists all files and folders in a given directory within the project. Use '.' for project root.",
        inputSchema: {
            type: "object",
            properties: {
                dirPath: {
                    type: "string",
                    description: "Directory path relative to project root (e.g., '.', 'controllers', 'routes')"
                }
            },
            required: ["dirPath"]
        }
    },
    {
        name: "read_source_code",
        description: "Reads the content of a specific source code file.",
        inputSchema: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "File path relative to project root (e.g., 'controllers/ordersController.js')"
                }
            },
            required: ["filePath"]
        }
    }
];

const sourceCodeHandler = async (toolName, args) => {
    try {
        if (toolName === "list_directory") {
            const targetDir = getSecurePath(args.dirPath);
            if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
                throw new Error(`Directory not found: ${args.dirPath}`);
            }
            const items = fs.readdirSync(targetDir);
            return {
                content: [{ type: "text", text: `Contents of /${args.dirPath}:\n${items.join('\n')}` }]
            };
        }

        if (toolName === "read_source_code") {
            const targetFile = getSecurePath(args.filePath);
            
            // Security: Prevent AI from reading .env files
            if (targetFile.includes('.env')) {
                throw new Error("Security Violation: Access to .env files is strictly prohibited.");
            }
            
            if (!fs.existsSync(targetFile) || !fs.statSync(targetFile).isFile()) {
                throw new Error(`File not found: ${args.filePath}`);
            }
            const code = fs.readFileSync(targetFile, 'utf8');
            return {
                content: [{ type: "text", text: `File: ${args.filePath}\n\n${code}` }]
            };
        }
    } catch (error) {
        return { content: [{ type: "text", text: `Source Code Error: ${error.message}` }], isError: true };
    }
};

module.exports = { sourceCodeTools, sourceCodeHandler };