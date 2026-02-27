#!/usr/bin/env bash
set -euo pipefail

# Applies baseline branch protection to main for core repositories.
# Requires: gh auth login (or GH_TOKEN/GITHUB_TOKEN with repo admin permission).

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI is required"
  exit 1
fi

repos=(
  "NEO-PROTOCOL/neobot"
  "NEO-PROTOCOL/neo-nexus"
  "NEO-PROTOCOL/mio-system"
  "NEO-PROTOCOL/neo-protocol-contracts"
  "NEO-PROTOCOL/neoflw-token"
)

ok_repos=()
failed_repos=()

for repo in "${repos[@]}"; do
  echo "Applying branch protection to $repo (main)"
  set +e
  response="$(
    gh api \
      --method PUT \
      -H "Accept: application/vnd.github+json" \
      "/repos/$repo/branches/main/protection" \
      --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON
  )"
  status=$?
  set -e

  if [[ "$status" -eq 0 ]]; then
    ok_repos+=("$repo")
    echo "  OK: $repo"
    continue
  fi

  failed_repos+=("$repo")
  echo "  FAIL: $repo"
  if [[ -n "$response" ]]; then
    echo "$response"
  fi
done

echo
echo "Summary:"
echo "  Success: ${#ok_repos[@]}"
for repo in "${ok_repos[@]}"; do
  echo "    - $repo"
done
echo "  Failed: ${#failed_repos[@]}"
for repo in "${failed_repos[@]}"; do
  echo "    - $repo"
done

if [[ "${#failed_repos[@]}" -gt 0 ]]; then
  exit 1
fi

echo "Done. Branch protection baseline applied to all repositories."
