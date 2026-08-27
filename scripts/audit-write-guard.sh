#!/usr/bin/env bash
# Confines the ui-auditor subagent's Write tool to the project's doc/ directory.
# Referenced by a PreToolUse hook in .claude/agents/ui-auditor.md.
# Place at: scripts/audit-write-guard.sh  (then: chmod +x scripts/audit-write-guard.sh)
#
# Claude Code passes the tool call as JSON on stdin. For a Write, the target path is
# tool_input.file_path. We allow the write only if that path resolves inside <root>/doc,
# where <root> is CLAUDE_PROJECT_DIR (set by Claude Code) or the current directory.
# Exit 0 = allow, exit 2 = block (the message on stderr is shown to the agent).

INPUT="$(cat)"

printf '%s' "$INPUT" | python3 -c '
import json, os, sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)  # unparseable input is not ours to judge; let the harness handle it

fp = (data.get("tool_input") or {}).get("file_path") or ""
if not fp:
    sys.exit(0)

root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
doc = os.path.realpath(os.path.join(root, "doc"))
target = os.path.realpath(fp if os.path.isabs(fp) else os.path.join(root, fp))

if target == doc or target.startswith(doc + os.sep):
    sys.exit(0)

sys.stderr.write(
    "Blocked: the ui-auditor may only write inside the project doc/ directory. "
    "Attempted: %s\n" % fp
)
sys.exit(2)
'