# COST-SAFETY AUDIT (Master Prompt)

You are a senior engineer doing a COST-SAFETY AUDIT of this entire codebase.
My goal: never be surprised by a huge API bill caused by a bug, loop, or abuse.
Work methodically and preserve existing functionality. Do not break existing features.

## Project Info (fill in if known, otherwise detect from the code)
- Stack: ___
- Paid providers used: ___
- Expected users per day: ___
- Monthly budget limit: ___

---

## PHASE 1: AUDIT (do this first, change nothing yet)
1. Scan the whole project and list EVERY external API call (AI models, payments, email/SMS, maps, storage, databases, any paid third-party service).
2. For each one, report: file + line, what triggers it, how often it can fire, which model/tier it uses, and whether it runs client-side or server-side.
3. Flag anything risky:
   - calls inside loops
   - useEffect/render/polling without limits
   - calls with no caching
   - duplicate calls
   - calls on every keystroke or page load
   - retries with no cap
   - webhooks that can re-trigger themselves
   - API keys exposed in frontend code
4. Show me this report and **wait for my approval before editing anything**.

## PHASE 2: FIX (after approval)
1. Remove or merge unnecessary and duplicate API requests.
2. Add caching/memoization where the same request gives the same result.
3. Add debouncing/throttling for user-triggered calls (search, typing, buttons).
4. Move all API keys and paid calls to the server/backend. Never expose keys in client code. Use environment variables.

## PHASE 3: GUARDRAILS (all values configurable via env vars/config file)
1. **Rate limits:** per user, per IP, and global (requests per minute/hour).
2. **Usage limits:** daily and monthly caps on requests and tokens/spend, per user and global. When hit, fail gracefully with a clear message.
3. **Retry cap:** max 3 retries, exponential backoff with jitter, never retry on 4xx errors (except 429 with Retry-After).
4. **Infinite-loop protection:** a circuit breaker that trips and stops all calls if the same endpoint is hit more than N times in a short window, plus request timeouts and max recursion/iteration limits on any agent/loop.
5. **Kill switch:** one env flag (e.g. `API_ENABLED=false`) that disables all paid calls instantly.
6. **Anomaly detection:** log every API call (endpoint, model, tokens, cost estimate, user). Alert (console/email/webhook) when usage spikes above a threshold (e.g. 3x the normal hourly rate) or a single user is abnormal.
7. **Hard input limits:** max prompt length, max output tokens (`max_tokens`), max file/image size, and max conversation history sent per request.

## PHASE 4: OPTIMIZE
1. Shorten and tighten prompts: remove redundant instructions, trim history, summarize old context, don't resend large static content every call.
2. Model routing: use the cheapest model that can do the job (small/fast model for simple tasks like classification, extraction, short replies; premium model only for hard reasoning). Make the model name a config value, not hardcoded.
3. Use prompt caching, batching, and streaming where the provider supports it.

## PHASE 5: COST ESTIMATE
Based on the actual code, estimate monthly cost for 3 scenarios: low / expected / worst-case (including a bug or abuse scenario WITH my new guardrails in place). Show assumptions: calls per user, avg input/output tokens, model pricing used, number of users. Present as a table.

## PHASE 6: REPORT
Give me:
- A summary of everything changed (file by file)
- Remaining risks I should know about
- A checklist of things I must do OUTSIDE the code: set hard spend limits and budget alerts in each provider's dashboard, rotate any exposed keys, and set up billing email alerts
- How to test that the limits and kill switch actually work

---

## RULES
- Ask me before making large architectural changes.
- Keep the app working at every step.
- Don't invent pricing. If you're unsure of current prices, say so and tell me where to verify.
- Stop after Phase 1 and wait for my approval before continuing.
- Double-check every file path, line number, and cost figure before reporting. If you are unsure about a finding, mark it as **uncertain** rather than guessing.
