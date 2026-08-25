# CLI Developer Toolkit

A Node.js command-line toolkit that brings together common developer utilities into a single CLI.

Instead of using separate scripts or tools for API testing, environment variable discovery, JSON comparison, and API mocking, this project provides them through one command:

```bash
devkit
```

## Features

| Command | Description |
|---|---|
| `check-api` | Check an API endpoint and display response details |
| `gen-env` | Generate a `.env.example` from `process.env` usage |
| `diff-json` | Compare two JSON files and show their differences |
| `mock-server` | Start a local mock API server from a JSON schema |

---

## Tech Stack

- **Node.js** — Runtime
- **Commander.js** — CLI command and argument handling
- **Axios** — HTTP requests
- **Express** — Mock API server
- **Chalk** — Terminal output formatting
- **Glob** — Source-code file discovery
- **ES Modules** — JavaScript module system

---

# Installation

## Clone the repository

```bash
git clone https://github.com/Yashika1503/cli-dev-toolkit.git
```

Navigate into the project:

```bash
cd cli-dev-toolkit
```

Install dependencies:

```bash
npm install
```

Install the CLI globally from the project:

```bash
npm install -g .
```

Verify the installation:

```bash
devkit --help
```

You should see the available commands:

```text
check-api
gen-env
diff-json
mock-server
```

---

# Commands

## 1. `check-api`

Check an API endpoint and display useful information about the request and response.

### Basic usage

```bash
devkit check-api <url>
```

Example:

```bash
devkit check-api https://jsonplaceholder.typicode.com/posts
```

Example output:

```text
✓ API is reachable

URL            https://jsonplaceholder.typicode.com/posts
Method         GET
Status         200 OK
Timeout        5000 ms
Time           200.42 ms
Content-Type   application/json
Size           1.23 KB
```

### Specify HTTP method

```bash
devkit check-api https://postman-echo.com/post --method POST
```

The default method is:

```text
GET
```

### Set a timeout

```bash
devkit check-api https://example.com --timeout 3000
```

The timeout is specified in milliseconds.

Default:

```text
5000 ms
```

### Add request headers

Headers can be supplied using `--header`:

```bash
devkit check-api https://api.github.com --header "Accept: application/json"
```

Multiple headers can be provided:

```bash
devkit check-api https://api.example.com \
  --header "Accept: application/json" \
  --header "Authorization: Bearer TOKEN"
```

> **PowerShell:** If using PowerShell, enter each option on the same line or use PowerShell's backtick continuation character instead of `\`.

### Send a JSON request body

For requests that require a JSON body, use `--body-file`:

```bash
devkit check-api https://postman-echo.com/post \
  --method POST \
  --body-file examples/body.json
```

Example `body.json`:

```json
{
  "message": "hello"
}
```

### What `check-api` provides

- HTTP method
- Response status
- Response status text
- Request timeout
- Response time
- Content type
- Response size
- Request headers
- JSON request body support
- Timeout and request error handling

---

# 2. `gen-env`

Automatically generate a `.env.example` file by scanning the project for environment variables accessed through:

```javascript
process.env
```

### Usage

Run the command from the root of your project:

```bash
devkit gen-env
```

For example, if your source code contains:

```javascript
const port = process.env.PORT;
const apiKey = process.env.API_KEY;
const databaseUrl = process.env.DATABASE_URL;
```

the generated `.env.example` will contain:

```env
PORT=
API_KEY=
DATABASE_URL=
```

Duplicate environment variables are removed automatically.

### Why use it?

When working on a project, environment variables are often required but should not be committed with their real values.

Instead of manually creating a `.env.example`, this command can discover the variables used by the project automatically.

### Important

Real secrets should be stored in:

```text
.env
```

and should **not** be committed to Git.

The generated:

```text
.env.example
```

contains variable names only and can safely be used as a template.

---

# 3. `diff-json`

Compare two JSON files and display what was added, removed, or changed.

### Usage

```bash
devkit diff-json <file1> <file2>
```

Example:

```bash
devkit diff-json old.json new.json
```

Suppose `old.json` contains:

```json
{
  "name": "Yashika",
  "age": 20,
  "city": "Delhi"
}
```

and `new.json` contains:

```json
{
  "name": "Yashika",
  "age": 21,
  "country": "India"
}
```

The command displays:

```text
Comparing old.json → new.json

~ age
  20 → 21

- city
  "Delhi"

+ country
  "India"
```

### Symbols

| Symbol | Meaning |
|---|---|
| `+` | Added |
| `-` | Removed |
| `~` | Changed |

If both files are identical:

```text
✓ No differences found
```

### Error handling

The command also handles:

- Missing files
- Invalid JSON
- Invalid file contents

For example:

```text
✗ File not found: old.json
```

or:

```text
✗ Invalid JSON in file: old.json
```

---

# 4. `mock-server`

Start a local mock API server using a JSON schema.

This is useful when developing a frontend or API client before the real backend is available.

### Usage

```bash
devkit mock-server <schema>
```

Example:

```bash
devkit mock-server examples/schema.json
```

By default, the server runs on:

```text
http://localhost:3000
```

### Custom port

You can specify a different port:

```bash
devkit mock-server examples/schema.json --port 4000
```

The server will then run on:

```text
http://localhost:4000
```

---

## Mock Server Schema

The schema defines routes and their responses.

Example:

```json
{
  "GET /users": {
    "id": 1,
    "name": "Yashika",
    "role": "developer"
  },
  "GET /products": {
    "id": 1,
    "name": "Laptop",
    "price": 50000
  },
  "POST /users": {
    "message": "User created"
  },
  "DELETE /users": {
    "message": "User deleted"
  }
}
```

The mock server dynamically creates the corresponding Express routes.

This produces:

```text
GET    /users
GET    /products
POST   /users
DELETE /users
```

### Example request

```bash
curl http://localhost:3000/users
```

Response:

```json
{
  "id": 1,
  "name": "Yashika",
  "role": "developer"
}
```

The mock server supports:

- GET
- POST
- PUT
- PATCH
- DELETE

### How it works

The schema is read and parsed by Node.js.

Each entry is then split into:

```text
HTTP method
+
route path
```

For example:

```text
GET /users
```

becomes:

```text
method = GET
path = /users
```

The corresponding Express route is then created dynamically.

This allows a single schema to define multiple mock endpoints without manually writing Express route handlers.

---

# Project Structure

```text
cli-dev-toolkit/
│
├── bin/
│   └── devkit.js
│
├── commands/
│   ├── checkApi.js
│   ├── diffJson.js
│   ├── genEnv.js
│   └── mockServer.js
│
├── services/
│   ├── apiChecker.js
│   ├── envGenerator.js
│   ├── jsonDiffer.js
│   └── mockServer.js
│
├── utils/
│   └── logger.js
│
├── examples/
│   ├── body.json
│   └── schema.json
│
├── .gitignore
├── package.json
└── README.md
```

---

# Architecture

The project separates CLI commands from the underlying functionality.

```text
User
 │
 ▼
devkit CLI
 │
 ├── check-api ──────► apiChecker service
 │
 ├── gen-env ────────► envGenerator service
 │
 ├── diff-json ──────► jsonDiffer service
 │
 └── mock-server ────► mockServer service
                              │
                              ▼
                           Express
```

### Commands

The `commands/` directory handles:

- CLI arguments
- Options
- User-facing errors
- Connecting the CLI to services

### Services

The `services/` directory contains the actual application logic.

This separation keeps the CLI layer thin and makes the functionality easier to maintain and test.

### Utilities

The `utils/` directory contains reusable functionality such as terminal logging.

---

# Design Decisions

## Why Commander.js?

Commander.js provides a simple way to define:

- Commands
- Arguments
- Options
- Help output
- CLI version information

This makes it suitable for building a multi-command developer CLI.

## Why Axios?

Axios provides a straightforward API for making HTTP requests while handling:

- HTTP methods
- Headers
- Timeouts
- Request bodies
- Response information
- Request errors

## Why Express?

Express makes it simple to dynamically create HTTP routes for the mock server.

Instead of manually creating a server for every mock API, the toolkit can generate routes directly from a JSON schema.

## Why separate commands and services?

Keeping CLI handling separate from business logic makes the application easier to understand and extend.

For example:

```text
commands/checkApi.js
```

handles the CLI interaction, while:

```text
services/apiChecker.js
```

handles the API request itself.

---

# Development

Clone the repository:

```bash
git clone https://github.com/Yashika1503/cli-dev-toolkit.git
cd cli-dev-toolkit
```

Install dependencies:

```bash
npm install
```

During development, the CLI can be installed globally from the local project:

```bash
npm install -g .
```

After making changes, reinstall if necessary:

```bash
npm install -g .
```

Then test:

```bash
devkit --help
```

---

# Example Workflow

A typical workflow might look like:

### Check an API

```bash
devkit check-api https://api.example.com/users
```

### Generate environment variable template

```bash
devkit gen-env
```

### Compare configuration files

```bash
devkit diff-json config.old.json config.new.json
```

### Start a mock backend

```bash
devkit mock-server examples/schema.json
```

The toolkit is designed to keep these common developer tasks available through one consistent CLI.

---

# Error Handling

The toolkit provides user-friendly error messages for common failures, including:

- Invalid URLs
- Failed API requests
- Request timeouts
- Invalid JSON
- Missing files
- Invalid mock-server schemas
- Unsupported HTTP methods

Instead of exposing raw Node.js errors whenever possible, the CLI reports concise messages that are easier to understand from the terminal.

---

# Future Improvements

Possible future additions include:

- Recursive JSON diffing
- Colored diff output
- Mock response delays
- Dynamic mock data generation
- Request logging for the mock server
- Configuration files
- Additional API testing options
- Publishing the package to npm
- Automated tests with a testing framework
- CI/CD with GitHub Actions

These features are intentionally outside the current core implementation.

---

# Learning Goals

This project was built to gain practical experience with:

- Node.js CLI development
- ES Modules
- Commander.js
- Express
- Axios
- File-system operations
- JSON parsing
- HTTP requests
- Dynamic route generation
- CLI argument and option handling
- npm package structure
- Git and GitHub workflows

---

# License

ISC

---

# Author

**Yashika Gaur**

GitHub:

https://github.com/Yashika1503
