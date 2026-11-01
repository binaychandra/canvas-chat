export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: "Applied" | "In Progress" | "Interview" | "Offer" | "Rejected";
  appliedOn: string;
  source: string;
  salary: string;
}

export const JOB_APPLICATIONS: JobApplication[] = [
  { id: "1", company: "Stripe", role: "Senior Frontend Engineer", location: "Remote", status: "Interview", appliedOn: "2026-06-12", source: "Referral", salary: "$180k" },
  { id: "2", company: "Vercel", role: "Product Engineer", location: "San Francisco, CA", status: "In Progress", appliedOn: "2026-06-18", source: "Careers page", salary: "$165k" },
  { id: "3", company: "Linear", role: "UI Engineer", location: "Remote", status: "Applied", appliedOn: "2026-06-21", source: "LinkedIn", salary: "$170k" },
  { id: "4", company: "Notion", role: "Fullstack Engineer", location: "New York, NY", status: "Rejected", appliedOn: "2026-05-30", source: "LinkedIn", salary: "$175k" },
  { id: "5", company: "Figma", role: "Design Systems Engineer", location: "Remote", status: "Offer", appliedOn: "2026-05-14", source: "Referral", salary: "$190k" },
  { id: "6", company: "Ramp", role: "Frontend Engineer II", location: "New York, NY", status: "Interview", appliedOn: "2026-06-02", source: "Wellfound", salary: "$168k" },
  { id: "7", company: "Retool", role: "Software Engineer", location: "Remote", status: "Applied", appliedOn: "2026-06-25", source: "Careers page", salary: "$160k" },
  { id: "8", company: "Supabase", role: "Developer Experience", location: "Remote", status: "In Progress", appliedOn: "2026-06-09", source: "Twitter", salary: "$155k" },
  { id: "9", company: "Airbnb", role: "Web Platform Engineer", location: "Seattle, WA", status: "Rejected", appliedOn: "2026-04-28", source: "LinkedIn", salary: "$185k" },
  { id: "10", company: "Datadog", role: "Frontend Engineer", location: "Boston, MA", status: "Applied", appliedOn: "2026-06-27", source: "Careers page", salary: "$172k" },
];

export const DASHBOARD_STATS = [
  { id: "total", label: "Applications", value: 24, hint: "+3 this week" },
  { id: "progress", label: "In Progress", value: 7, hint: "2 awaiting reply" },
  { id: "interviews", label: "Interviews", value: 4, hint: "1 scheduled today" },
  { id: "offers", label: "Offers", value: 1, hint: "Figma · expires in 6d" },
];

export interface InterviewTopic {
  id: string;
  label: string;
  group: string;
  markdown: string;
}

export const INTERVIEW_TOPICS: InterviewTopic[] = [
  {
    id: "arrays",
    group: "Data Structures & Algorithms",
    label: "Arrays & Hashing",
    markdown: `# Arrays & Hashing

Hash maps turn most array scanning problems from **O(n²)** into **O(n)**.

## Patterns to know
- Two-sum style complement lookups
- Frequency counting with a map
- Prefix sums for range queries
- Sliding window for contiguous subarrays

## Sample question
> Given an array of integers, return indices of the two numbers that add up to a target.

\`\`\`ts
function twoSum(nums: number[], target: number) {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}
\`\`\`

## Follow-ups interviewers love
1. What if the array is sorted? (two pointers, O(1) space)
2. What if you need all unique pairs?
3. How does hashing degrade with adversarial inputs?`,
  },
  {
    id: "graphs",
    group: "Data Structures & Algorithms",
    label: "Graphs & Traversal",
    markdown: `# Graphs & Traversal

## Core traversals
| Traversal | Structure | Use case |
| --- | --- | --- |
| BFS | Queue | Shortest path on unweighted graphs |
| DFS | Stack / recursion | Cycle detection, topological order |
| Dijkstra | Min-heap | Weighted shortest path |

## Checklist
- Clarify directed vs undirected
- Confirm whether the graph can be disconnected
- Track \`visited\` before pushing, not after popping

## Sample question
> Count the number of islands in a grid of land and water cells.`,
  },
  {
    id: "system-design",
    group: "System Design",
    label: "Designing a URL Shortener",
    markdown: `# Designing a URL Shortener

## Requirements
- **Functional**: create short link, redirect, custom alias, expiry
- **Non-functional**: 100:1 read/write ratio, <100ms p99 redirect

## Back of the envelope
- 100M new URLs / month → ~40 writes/sec
- 10B redirects / month → ~4k reads/sec

## Design sketch
\`\`\`text
Client → CDN → API Gateway → Redirect Service → Cache (Redis)
                                   ↓ miss
                              Key-Value store
\`\`\`

## Key decisions
1. **ID generation** — base62 of a distributed counter beats random collision checks.
2. **Caching** — LRU on hot keys covers ~90% of redirects.
3. **Analytics** — write to a queue, never in the redirect path.`,
  },
  {
    id: "scaling",
    group: "System Design",
    label: "Caching & Scaling",
    markdown: `# Caching & Scaling

## The cache hierarchy
- Browser → CDN → App memory → Distributed cache → Database

## Invalidation strategies
- **TTL** — simplest, tolerates staleness
- **Write-through** — consistent, slower writes
- **Write-behind** — fast, risk of loss

## Talking points
> "I'd start with read-through caching and a short TTL, then measure hit rate before adding complexity."`,
  },
  {
    id: "behavioral",
    group: "Behavioral",
    label: "STAR Stories",
    markdown: `# STAR Stories

Structure every answer as **Situation → Task → Action → Result**.

## Stories to prepare
- A time you disagreed with a teammate
- A project that failed and what you changed
- Something you shipped under a hard deadline
- Feedback that changed how you work

## Result lines that land
- "Cut p95 load time from 3.1s to 900ms."
- "Reduced on-call pages by 40% in one quarter."`,
  },
  {
    id: "questions",
    group: "Behavioral",
    label: "Questions To Ask",
    markdown: `# Questions To Ask Them

## About the team
- How is work chosen and prioritized?
- What does the first 90 days look like?

## About the craft
- How do you balance shipping speed with code quality?
- What does the review and release process look like?

## About growth
- What separates a strong engineer from a great one here?`,
  },
];

export const INTERVIEW_PROMPTS = [
  "Quiz me on graph traversal",
  "Mock interview: system design",
  "Review my STAR story",
  "Common React interview questions",
];

export const LLM_PROVIDERS = [
  { id: "openai", label: "OpenAI", models: ["gpt-5.2", "gpt-5.2-mini", "gpt-5.1"] },
  { id: "anthropic", label: "Anthropic", models: ["claude-sonnet-4.6", "claude-opus-4.2"] },
  { id: "google", label: "Google", models: ["gemini-3.6-pro", "gemini-3.6-flash"] },
  { id: "local", label: "Local (Ollama)", models: ["llama4:70b", "qwen3:32b"] },
];
