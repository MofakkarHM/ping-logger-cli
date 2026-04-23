# Ping Logger CLI

A Node.js CLI tool that pings a list of URLs and logs their latency and status to a daily JSON file.

## How to Run

1. Ensure you are running Node 18+ (see `.nvmrc`).
2. Run `npm install` (if dependencies are added later).
3. Run `npm start`.

## Self-Evaluation Scorecard

| Dimension                  | Score (1–4) | Evidence                                                                                    |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| D1 Functionality           | 4           | Handles offline hosts gracefully. Writes correctly formatted JSON.                          |
| D2 Code Quality            | 4           | Separated logic into `cli.js`, `fetcher.js`, and `writer.js`.                               |
| D3 Validation              | 4           | Catches malformed URLs, implements 5-second timeouts.                                       |
| D4 Developer Experience    | 4           | Clean output via `console.table`. Pinpoint Node versioning.                                 |
| D5 Testing & Observability | 4           | Multiple commits on a feature branch. Test URLs cover timeouts, 200s, and network failures. |
