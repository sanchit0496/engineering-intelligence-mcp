# Engineering Intelligence MCP

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-black?logo=express)
![MCP](https://img.shields.io/badge/Model_Context_Protocol-MCP-blue)
![Swagger](https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?logo=swagger)
![Winston](https://img.shields.io/badge/Winston-Logging-orange) ![Claude
Desktop](https://img.shields.io/badge/Claude%20Desktop-Tested-success)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

A production-oriented **Model Context Protocol (MCP)** server for
**Express.js** applications that enables AI clients to inspect backend
systems through structured engineering tools instead of direct file
system access.

The server exposes backend engineering context including **Git
history**, **Winston logs**, **OpenAPI/Swagger contracts**, and
**sandboxed source code** through MCP tools. The implementation has been
validated using both the **official MCP Inspector** and **Claude
Desktop**.

------------------------------------------------------------------------

# Features

- MCP-compliant server using the official MCP SDK
- Tool Registry based architecture
- Git history provider
- Winston log provider
- Dynamic Swagger/OpenAPI provider
- Sandboxed source code provider
- Compatible with Claude Desktop
- Validated using the official MCP Inspector
- Extensible provider architecture
- Read-only engineering context

------------------------------------------------------------------------

# Architecture

``` mermaid
flowchart TD

Client[Claude Desktop / MCP Inspector]

Transport[STDIO Transport]

Server[MCP Server]

Registry[Tool Registry]

Git[Git Provider]

Swagger[Swagger Provider]

Logs[Winston Provider]

Source[Source Code Provider]

Express[(Express Application)]

Client <--> Transport
Transport <--> Server
Server --> Registry
Registry --> Git
Registry --> Swagger
Registry --> Logs
Registry --> Source

Git --> Express
Swagger --> Express
Logs --> Express
Source --> Express
```

------------------------------------------------------------------------

# Provider Responsibilities

| Provider         | Responsibility                                           |
|------------------|----------------------------------------------------------|
| Git Provider     | Reads Git commit history for project files               |
| Swagger Provider | Reads dynamically generated OpenAPI contracts            |
| Log Provider     | Retrieves Winston application logs                       |
| Source Provider  | Lists directories and securely reads project source code |
| Tool Registry    | Registers and dispatches MCP tool requests               |

------------------------------------------------------------------------

# Tech Stack

| Category          | Technology             |
|-------------------|------------------------|
| Runtime           | Node.js                |
| Framework         | Express.js             |
| Protocol          | Model Context Protocol |
| Logging           | Winston                |
| API Documentation | Swagger JSDoc          |
| Database          | MySQL + Sequelize      |
| Version Control   | Git                    |
| AI Client         | Claude Desktop         |
| Testing           | MCP Inspector          |

------------------------------------------------------------------------

# Installation

``` bash
git clone <repository>

npm install

npm run dev
```

Configure Claude Desktop:

``` json
{
  "mcpServers": {
    "engineering-intelligence": {
      "command": "node",
      "args": [
        "/absolute/path/mcp/server.js"
      ]
    }
  }
}
```

Restart Claude Desktop.

------------------------------------------------------------------------

# Available MCP Tools

| Tool                 | Description                            |
|----------------------|----------------------------------------|
| check_file_history   | Returns recent Git history for a file  |
| read_winston_logs    | Reads recent Winston logs              |
| analyze_api_contract | Reads OpenAPI contract for an endpoint |
| list_directory       | Lists project directories              |
| read_source_code     | Reads project source files securely    |

------------------------------------------------------------------------

# Working Example

## Prompt

> Compare the implementation of **POST /orders** with its OpenAPI
> contract.

### Tool Execution

| Phase                   | Tool                 |
|-------------------------|----------------------|
| API Contract Inspection | analyze_api_contract |
| Source Inspection       | read_source_code     |
| Analysis                | Claude Desktop       |

### Result

The server successfully detected a contract mismatch between the
documented API and the controller implementation.

Example:

- Swagger contract expects **customerId**
- Controller consumes **userId**

This demonstrates how multiple MCP tools can be orchestrated by an AI
client to investigate backend implementation issues.

------------------------------------------------------------------------

# Testing

The implementation was validated using two independent MCP clients.

## MCP Inspector

<img width="1456" height="761" alt="image" src="https://github.com/user-attachments/assets/504675df-7545-4ff9-9c42-f43b0e14c785" />


- Tool discovery
- Tool execution
- Protocol validation
- Response verification

## Claude Desktop

Successfully connected without code changes.

<img width="1241" height="800" alt="image" src="https://github.com/user-attachments/assets/57a4794c-1c35-4402-85a3-498f5592987b" />


Validated:

- Git history inspection
- Winston log retrieval
- Swagger analysis
- Source code inspection

This confirms interoperability with real MCP clients.

------------------------------------------------------------------------

# Project Structure

``` text
project/
├── app.js
├── index.js
├── logger.js
├── swaggerConfig.js
├── controllers/
├── models/
├── routes/
├── validations/
├── config/
├── mcp/
│   ├── server.js
│   ├── registry/
│   │    └── toolRegistry.js
│   └── providers/
│        ├── gitProvider.js
│        ├── logProvider.js
│        ├── swaggerProvider.js
│        └── sourceCodeProvider.js
└── package.json
```

------------------------------------------------------------------------

# Roadmap

- AST-based source code analysis
- Sequelize schema provider
- Express route dependency graph
- Architecture summarization
- Middleware analysis
- Configuration provider
- Project dependency analysis

------------------------------------------------------------------------

# License

Licensed under the ISC License.
