# Ping Logger CLI

A lightweight Node.js CLI tool that monitors URL/service health by pinging a list of endpoints, recording their status and latency, and alerting on consecutive failures. Perfect for quick health checks, uptime monitoring, and historical tracking.

## Features

- ✅ **Parallel pinging** — fetch all URLs concurrently for speed
- ✅ **Timeout handling** — 5-second timeout per request with graceful fallback
- ✅ **URL validation** — rejects malformed URLs upfront
- ✅ **Daily logs** — timestamped JSON files (`logs/YYYY-MM-DD.json`)
- ✅ **Consecutive failure detection** — alerts when a host is down 3 runs in a row
- ✅ **Graceful error handling** — network errors, timeouts, and invalid URLs all handled
- ✅ **Clean output** — `console.table()` for readable results
- ✅ **Configurable input/output** — custom file paths via CLI flags

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** (comes with Node)

Check your version:

```bash
node --version  # should be v18.0.0+
npm --version
```

## Installation

Clone and install:

```bash
git clone <repository-url>
cd ping-logger-cli
npm install
```

Or install dependencies manually (if added later):

```bash
npm install
```

## Quick Start

### 1. Set up your device list

Edit or create `devices.json` with URLs to monitor:

```json
[
  "https://google.com",
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://httpstat.us/500",
  "https://my-api.example.com/health"
]
```

### 2. Run the CLI

```bash
npm start
```

This will:

- Read `devices.json`
- Ping each URL in parallel
- Check for consecutive failures (3 runs in a row)
- Write results to `logs/YYYY-MM-DD.json`
- Display results in a table

### 3. View the output

Results appear in two places:

- **Console**: A formatted table with status, latency, and alerts
- **Disk**: Daily log file at `logs/YYYY-MM-DD.json`

## Usage

### Basic Usage

```bash
npm start
```

### Test Mode

Run against the included test fixture:

```bash
npm run test
```

This uses `test.json` instead of `devices.json` and demonstrates all edge cases (valid IPs, timeouts, network errors, invalid URLs).

### Custom Input File

```bash
npm start -- --input my-urls.json
```

### Custom Output Directory

```bash
npm start -- --out my-logs
```

### Combined Options

```bash
npm start -- --input monitoring.json --out results
```

## Output Format

### Console Output

```
Starting Ping Logger... (Input: devices.json | out: logs)

┌─────────┬──────────────────────────────────────────┬───────────────┬──────┬────────────────────────┐
│ (index) │ host                                     │ statusCode    │ ms   │ alert                  │
├─────────┼──────────────────────────────────────────┼───────────────┼──────┼────────────────────────┤
│ 0       │ https://jsonplaceholder.typicode.com/1   │ 200           │ 145  │                        │
│ 1       │ https://httpstat.us/500                  │ 500           │ 234  │                        │
│ 2       │ https://bad-domain.fake                  │ DOWN          │ 5000 │ Down 3 runs in a row   │
│ 3       │ not-valid-url                            │ INVALID_URL   │ 0    │                        │
└─────────┴──────────────────────────────────────────┴───────────────┴──────┴────────────────────────┘

Wrote 4 records to logs/2026-04-27.json
```

### Log File Format (`logs/YYYY-MM-DD.json`)

```json
[
  {
    "host": "https://jsonplaceholder.typicode.com/posts/1",
    "statusCode": 200,
    "ms": 145
  },
  {
    "host": "https://httpstat.us/500",
    "statusCode": 500,
    "ms": 234
  },
  {
    "host": "https://bad-domain.fake",
    "statusCode": "DOWN",
    "ms": 5000,
    "alert": "Down 3 runs in a row"
  },
  {
    "host": "not-valid-url",
    "statusCode": "INVALID_URL",
    "ms": 0
  }
]
```

### Status Code Values

| Value         | Meaning                                                                |
| ------------- | ---------------------------------------------------------------------- |
| `200–599`     | HTTP status code (e.g., 200 = OK, 404 = Not Found, 500 = Server Error) |
| `DOWN`        | Connection failed or network error                                     |
| `TIMEOUT`     | Request exceeded 5-second limit                                        |
| `INVALID_URL` | URL failed validation (malformed format)                               |

## Project Structure

```
ping-logger-cli/
├── src/
│   ├── cli.ts          # Entry point, orchestrates workflow
│   ├── fetcher.ts      # HTTP fetching logic, URL validation
│   └── writer.ts       # File I/O, consecutive failure detection
├── logs/               # Output directory (created automatically)
│   ├── 2026-04-26.json
│   └── 2026-04-27.json
├── devices.json        # Input: list of URLs to monitor
├── test.json           # Test fixture with edge cases
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## How It Works

### Workflow

```
1. CLI reads devices.json
   ↓
2. Parallel fetch phase
   • Validate each URL format
   • Make HTTP request (5s timeout)
   • Record status code + latency
   ↓
3. Consecutive failure detection
   • Load previous 2 log files (if they exist)
   • Check if current host was down in both
   • If yes, add alert: "Down 3 runs in a row"
   ↓
4. Write daily log
   • Create logs/ directory if needed
   • Write results to logs/YYYY-MM-DD.json
   ↓
5. Display results
   • Print formatted table to console
```

### URL Validation

URLs are validated using the `URL` constructor. Valid formats:

```
✅ https://google.com
✅ https://api.example.com:8080/path
✅ http://192.168.1.1
✅ https://example.com/health?v=1
✗ google.com (missing protocol)
✗ not-a-url
✗ ht://invalid (malformed)
```

### Timeout Behavior

Each request has a 5-second timeout (`AbortSignal.timeout(5000)`):

- If the server responds within 5s → record the status code
- If the server doesn't respond → record `TIMEOUT`
- If the network fails → record `DOWN`

## Development

### Build TypeScript

```bash
npm run build
```

Outputs compiled JavaScript to `dist/` (if configured).

### Running in Development

```bash
npm start
```

Uses `tsx` for live TypeScript execution (no build step needed).

### Modifying the Code

- **Fetcher logic**: `src/fetcher.ts` — change timeout, add retry logic, etc.
- **Writer logic**: `src/writer.ts` — modify alert threshold (currently 3 consecutive failures)
- **CLI logic**: `src/cli.ts` — add new command-line flags, change defaults

## Troubleshooting

### "Cannot find module 'X'"

```bash
npm install
```

### "ENOENT: no such file or directory"

Ensure `devices.json` exists in the current directory, or use `--input` to specify a custom path.

### "Invalid URL"

Check `devices.json` for malformed URLs. All must include the protocol (`http://` or `https://`).

### Node version mismatch

```bash
node --version
# If not 18+, install it via nvm, n, or direct download
```

### All hosts showing "DOWN"

- Check your network connectivity
- Verify firewall isn't blocking requests
- Test with `curl https://google.com` to confirm

## Learning Context

This is a **Phase 0 capstone project** from the InfraSight learning roadmap. It demonstrates:

✅ Node.js fundamentals (async/await, error handling, file I/O)  
✅ TypeScript (interfaces, type safety)  
✅ HTTP requests (fetch API with timeouts)  
✅ CLI patterns (argument parsing)  
✅ Data persistence (daily logs)

It prepares you for:
→ Phase 1: TypeScript, React, SQL  
→ Phase 2: Express, databases, Docker  
→ Phase 3+: Microservices, authentication, monitoring

## License

ISC
