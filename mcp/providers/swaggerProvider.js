// mcp/providers/swaggerProvider.js
const path = require('path');

// 1. Directly import the dynamically generated swagger object
// NOTE: Path dhyaan se check kar lena. Agar 'swaggerConfig.js' root mein hai, toh '../../swaggerConfig' sahi hai.
const { swaggerSpec } = require('../../swaggerConfig'); 

/**
 * Parses the dynamic Swagger object and extracts details for a specific route.
 */
async function fetchRouteDetails(route, method) {
    try {
        if (!swaggerSpec || !swaggerSpec.paths) {
            throw new Error("Swagger specification is not initialized or paths are missing. Check if annotations are correct.");
        }

        // Standardize inputs (e.g., "orders" -> "/orders")
        const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
        const normalizedMethod = method ? method.toLowerCase() : null;

        const pathData = swaggerSpec.paths[normalizedRoute];

        if (!pathData) {
            return { success: false, error: `Route ${normalizedRoute} not found in API documentation.` };
        }

        let resultData;
        if (normalizedMethod) {
            if (!pathData[normalizedMethod]) {
                return { success: false, error: `Method ${method.toUpperCase()} not found for route ${normalizedRoute}.` };
            }
            // If AI asked for a specific method (e.g., POST)
            resultData = {
                route: normalizedRoute,
                method: method.toUpperCase(),
                details: pathData[normalizedMethod]
            };
        } else {
            // If AI just asked for the route, return all methods (GET, POST, etc.)
            resultData = {
                route: normalizedRoute,
                methods: pathData
            };
        }

        return { success: true, data: resultData };

    } catch (error) {
        throw new Error(`Swagger parsing error: ${error.message}`);
    }
}

// ---------------------------------------------------------
// Tool Registry Definitions
// ---------------------------------------------------------

const swaggerTools = [
    {
        name: "analyze_api_contract",
        description: "Reads the dynamic Swagger/OpenAPI documentation to get request/response schemas for a specific API route. Crucial for debugging frontend-backend contract mismatches.",
        inputSchema: {
            type: "object",
            properties: {
                route: {
                    type: "string",
                    description: "The API endpoint path (e.g., '/orders', '/users')."
                },
                method: {
                    type: "string",
                    description: "Optional. The HTTP method (e.g., 'GET', 'POST'). If omitted, returns all methods for the route."
                }
            },
            required: ["route"]
        }
    }
];

const swaggerHandler = async (toolName, args) => {
    if (toolName === "analyze_api_contract") {
        try {
            const { route, method } = args;
            const result = await fetchRouteDetails(route, method);
            
            if (!result.success) throw new Error(result.error);
            
            return {
                content: [{
                    type: "text",
                    text: `API Contract for ${route}:\n${JSON.stringify(result.data, null, 2)}`
                }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `API Contract Error: ${error.message}` }],
                isError: true
            };
        }
    }
};

module.exports = { swaggerTools, swaggerHandler };