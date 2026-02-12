---
name: scheduler
description: Allows Neobot to schedule future tasks, messages, and command executions.
---

# Scheduler Skill

Use this skill to schedule tasks for later. You can schedule recurring jobs or one-off "at" jobs.

## Tools

### `scheduler_add`

Adds a new scheduled job.

**Parameters:**
- `name` (string): Human-readable name for the job.
- `when` (string): When to run. Can be a relative time (e.g. "in 15 minutes", "tomorrow at 10am") or a cron expression.
- `command` (string): The command to run (e.g. `neobot run ops-status`).
- `to` (string, optional): A target for a message (e.g. `@username` on telegram).
- `message` (string, optional): A message to send.

**Usage:**
```bash
node skills/scheduler/scripts/scheduler.sh add --name "Remind Julia" --when "in 15 minutes" --command "neobot telegram send --to @anacarolinamaia --message 'vamos fumar?'"
```

### `scheduler_list`

Lists all scheduled jobs.

### `scheduler_remove`

Removes a scheduled job by ID or name.

**Parameters:**
- `id` (string): The job ID or name.
