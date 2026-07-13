const fs = require('fs');
const path = require('path');

// Logs directory ka path
const LOGS_DIR = path.join(__dirname, '../../logs'); 

/**
 * Audit file se latest log file ka path nikalna.
 */
/**
 * Audit file se latest log file ka path nikalna.
 */
function getLatestLogFilePath() {
    try {
        if (!fs.existsSync(LOGS_DIR)) throw new Error("Logs directory does not exist.");

        const files = fs.readdirSync(LOGS_DIR);
        const auditFileName = files.find(f => f.endsWith('-audit.json'));
        if (!auditFileName) throw new Error("Winston audit file not found.");

        const auditFilePath = path.join(LOGS_DIR, auditFileName);
        const auditData = JSON.parse(fs.readFileSync(auditFilePath, 'utf8'));

        if (!auditData.files || auditData.files.length === 0) {
            throw new Error("No log files tracked in audit.");
        }

        const latestFileEntry = auditData.files[auditData.files.length - 1];
        
        // 🟢 THE FIX: Normalize slashes (Windows to POSIX) and extract just the filename
        const rawName = latestFileEntry.name;
        const cleanFileName = rawName.replace(/\\/g, '/').split('/').pop();
        
        return path.join(LOGS_DIR, cleanFileName);
    } catch (error) {
        throw new Error(`Failed to locate latest log file: ${error.message}`);
    }
}

/**
 * Simplified non-streaming version using fs.readFileSync
 */
async function fetchRecentLogs(lineCount = 50) {
    const latestLogPath = getLatestLogFilePath();
    
    if (!fs.existsSync(latestLogPath)) {
        return { success: false, error: `Log file not found at ${latestLogPath}` };
    }

    // Seedha poori file memory mein read kar li
    const fileContent = fs.readFileSync(latestLogPath, 'utf8');
    
    // Lines mein split kiya aur empty lines hata di
    const allLines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    // Last N lines utha li array se
    const recentLines = allLines.slice(-lineCount);

    return { success: true, source: latestLogPath, data: recentLines };
}

// ---------------------------------------------------------
// Tool Registry Definitions
// ---------------------------------------------------------

const logTools = [
    {
        name: "read_winston_logs",
        description: "Reads the most recent application logs to investigate server errors.",
        inputSchema: {
            type: "object",
            properties: {
                lines: { 
                    type: "number", 
                    description: "Number of recent log lines to fetch (default is 50)." 
                }
            }
        }
    }
];

const logHandler = async (toolName, args) => {
    if (toolName === "read_winston_logs") {
        try {
            const lines = args.lines || 50;
            const result = await fetchRecentLogs(lines);
            
            if (!result.success) throw new Error(result.error);
            
            return {
                content: [{ 
                    type: "text", 
                    text: `Source: ${result.source}\n\n${result.data.join('\n')}` 
                }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Log Error: ${error.message}` }],
                isError: true
            };
        }
    }
};

module.exports = { logTools, logHandler };