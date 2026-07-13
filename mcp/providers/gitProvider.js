const simpleGit = require('simple-git');
const path = require('path');

// Initialize git at the root of nodejs_monolithic
const git = simpleGit(path.join(__dirname, '../../')); 

const gitTools = [
    {
        name: "check_file_history",
        description: "Get the last 5 commits for a specific file to understand ownership or recent changes.",
        inputSchema: {
            type: "object",
            properties: {
                filePath: { type: "string", description: "Path relative to project root (e.g., controllers/ordersController.js)" }
            },
            required: ["filePath"]
        }
    }
];

const gitHandler = async (toolName, args) => {
    if (toolName === "check_file_history") {
        try {
            const log = await git.log({ file: args.filePath, n: 5 });
            return {
                content: [{ 
                    type: "text", 
                    text: JSON.stringify(log.all, null, 2) 
                }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Git Error: ${error.message}` }],
                isError: true
            };
        }
    }
};

module.exports = { gitTools, gitHandler };