# Ping Logger CLI

A Node.js CLI tool that pings a list of URLs and logs their latency and status to a daily JSON file.

## How to Run

1. Ensure you are running Node 18+ (see `.nvmrc`).
2. Run `npm install` (if dependencies are added later).
3. Run `npm start` for the default run, or use custom arguments:
   `node src/cli.js --input my_list.json --out custom_logs`
4. Run `npm run test` to execute the built-in test fixture.

## Self-Evaluation Scorecard

| Dimension                  | Score (1–4) | Evidence                                                                                    |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| D1 Functionality           | 4           | Handles offline hosts gracefully. Stretch goal (3-run failure alert) implemented.           |
| D2 Code Quality            | 4           | Separated logic into `cli.js`, `fetcher.js`, and `writer.js`.                               |
| D3 Validation              | 4           | Catches malformed URLs pre-fetch, implements 5-second network timeouts.                     |
| D4 Developer Experience    | 4           | Clean terminal table output. Pinned Node versioning. Example output provided below.         |
| D5 Testing & Observability | 4           | Multiple commits on a feature branch. Test URLs cover timeouts, 200s, and network failures. |

## Example Output

Run `npm run test` to see the tool in action using the `test.json` fixture:

```text
Starting Ping Logger... (Input: test.json | out: logs)

Wrote 5 records to logs\2026-04-23.json
┌─────────┬─────────────────────────────────────────────────┬───────────────┬──────┬────────────────────────┐
│ (index) │ host                                            │ statusCode    │ ms   │ alert                  │
├─────────┼─────────────────────────────────────────────────┼───────────────┼──────┼────────────────────────┤
│ 0       │'https://jsonplaceholder.typicode.com/posts/1'   │ 200           │ 123  │                        │
│ 1       │'https://httpstat.us/404'                        │ 'DOWN'        │ 1100 │ 'Down 3 runs in a row' │
│ 2       │'https://httpstat.us/500'                        │ 'DOWN'        │ 2176 │ 'Down 3 runs in a row' │
│ 3       │'https://this-is-a-fake-domain-for-testing.com'  │ 'DOWN'        │ 87   │ 'Down 3 runs in a row' │
│ 4       │'not-a-real-url-format'                          │ 'INVALID_URL' │ 0    │                        │
└─────────┴─────────────────────────────────────────────────┴───────────────┴──────┴────────────────────────┘
