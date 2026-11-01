import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JOB_APPLICATIONS, type JobApplication } from "@/lib/app-data";

export const Route = createFileRoute("/job-tracker")({
  head: () => ({
    meta: [
      { title: "Job Tracker — every application in one table" },
      {
        name: "description",
        content:
          "A spreadsheet-style tracker for every role you've applied to, with search across company, role, status and source.",
      },
      { property: "og:title", content: "Job Tracker — every application in one table" },
      {
        property: "og:description",
        content: "Search and scan your full application pipeline in a single table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobTrackerPage,
});

const STATUS_STYLES: Record<JobApplication["status"], string> = {
  Applied: "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/10 text-primary",
  Interview: "bg-chart-2/15 text-chart-2",
  Offer: "bg-chart-4/20 text-chart-4",
  Rejected: "bg-destructive/10 text-destructive",
};

function JobTrackerPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOB_APPLICATIONS;
    return JOB_APPLICATIONS.filter((j) =>
      [j.company, j.role, j.location, j.status, j.source].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-hero">
      <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Job Tracker</h1>
          <p className="text-xs text-muted-foreground">
            {rows.length} of {JOB_APPLICATIONS.length} applications
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, role, status…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px]">Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Comp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((j) => (
                <TableRow key={j.id} className="transition-colors hover:bg-muted/40">
                  <TableCell className="font-medium">{j.company}</TableCell>
                  <TableCell>{j.role}</TableCell>
                  <TableCell className="text-muted-foreground">{j.location}</TableCell>
                  <TableCell>
                    <Badge className={`border-0 ${STATUS_STYLES[j.status]}`}>{j.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{j.appliedOn}</TableCell>
                  <TableCell className="text-muted-foreground">{j.source}</TableCell>
                  <TableCell className="text-right tabular-nums">{j.salary}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No applications match “{query}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
