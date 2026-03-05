#!/usr/bin/env bash
set -euo pipefail

# Removes required status checks from default branches to avoid CI-based merge blocking.
# Usage:
#   scripts/relax-branch-protection.sh                     # default org set
#   scripts/relax-branch-protection.sh ORG1 ORG2          # custom org set
#   scripts/relax-branch-protection.sh owner/repo ...     # explicit repos
#
# Requires: gh auth with repository admin permissions.

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI is required"
  exit 1
fi

declare -a default_orgs=(
  "NEO-PROTOCOL"
  "NEO-FlowOFF"
  "neo-smart-factory"
  "FluxxDAO"
  "wodxpro"
  "flowpay-system"
)

declare -a repos=()
declare -a orgs=()

if [[ "$#" -eq 0 ]]; then
  orgs=("${default_orgs[@]}")
else
  for arg in "$@"; do
    if [[ "$arg" == */* ]]; then
      repos+=("$arg")
    else
      orgs+=("$arg")
    fi
  done
fi

if [[ "${#repos[@]}" -eq 0 ]]; then
  if [[ "${#orgs[@]}" -eq 0 ]]; then
    orgs=("${default_orgs[@]}")
  fi
  for org in "${orgs[@]}"; do
    set +e
    list="$(gh api "orgs/$org/repos?per_page=200" --jq '.[].full_name' 2>&1)"
    status=$?
    set -e
    if [[ "$status" -ne 0 ]]; then
      echo "WARN: cannot list repos for $org: $list"
      continue
    fi
    while IFS= read -r repo; do
      [[ -n "$repo" ]] && repos+=("$repo")
    done <<< "$list"
  done
fi

if [[ "${#repos[@]}" -eq 0 ]]; then
  echo "No repositories found."
  exit 0
fi

declare -a changed=()
declare -a skipped=()
declare -a failed=()

for repo in "${repos[@]}"; do
  set +e
  default_branch="$(gh api "repos/$repo" --jq '.default_branch' 2>&1)"
  status=$?
  set -e
  if [[ "$status" -ne 0 ]]; then
    failed+=("$repo | default branch lookup failed: $default_branch")
    continue
  fi

  set +e
  result="$(gh api -X DELETE "repos/$repo/branches/$default_branch/protection/required_status_checks" 2>&1)"
  status=$?
  set -e

  if [[ "$status" -eq 0 ]]; then
    changed+=("$repo@$default_branch")
    echo "UPDATED: $repo@$default_branch required_status_checks removed"
    continue
  fi

  if grep -q "Branch not protected (HTTP 404)" <<< "$result"; then
    skipped+=("$repo@$default_branch | branch not protected")
    echo "SKIP: $repo@$default_branch branch not protected"
    continue
  fi

  if grep -q "Required status checks not enabled (HTTP 404)" <<< "$result"; then
    skipped+=("$repo@$default_branch | required status checks already disabled")
    echo "SKIP: $repo@$default_branch required status checks already disabled"
    continue
  fi

  if grep -q "Upgrade to GitHub Pro or make this repository public" <<< "$result"; then
    skipped+=("$repo@$default_branch | branch protection unavailable on current plan")
    echo "SKIP: $repo@$default_branch branch protection unavailable on current plan"
    continue
  fi

  if grep -q "Upgrade to GitHub Team to enable this feature" <<< "$result"; then
    skipped+=("$repo@$default_branch | org rulesets unavailable on current plan")
    echo "SKIP: $repo@$default_branch org rulesets unavailable on current plan"
    continue
  fi

  failed+=("$repo@$default_branch | $result")
  echo "FAIL: $repo@$default_branch $result"
done

echo
echo "Summary:"
echo "  Updated: ${#changed[@]}"
for item in "${changed[@]}"; do
  echo "    - $item"
done
echo "  Skipped: ${#skipped[@]}"
for item in "${skipped[@]}"; do
  echo "    - $item"
done
echo "  Failed: ${#failed[@]}"
for item in "${failed[@]}"; do
  echo "    - $item"
done

if [[ "${#failed[@]}" -gt 0 ]]; then
  exit 1
fi
