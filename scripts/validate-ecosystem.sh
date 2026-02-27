#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/config/ecosystem.json"
BASE_DIR="$ROOT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required to validate ecosystem.json"
  exit 1
fi

if ! jq empty "$CONFIG_FILE" >/dev/null 2>&1; then
  echo "ERROR: invalid JSON in $CONFIG_FILE"
  exit 1
fi

errors=0

require_unique_ids() {
  local dup_ids
  dup_ids="$(jq -r 'group_by(.id)[] | select(length > 1) | .[0].id' "$CONFIG_FILE")"
  if [[ -n "$dup_ids" ]]; then
    echo "ERROR: duplicate node ids found:"
    echo "$dup_ids" | sed 's/^/  - /'
    errors=$((errors + 1))
  fi
}

ensure_flowpay_core_excluded() {
  if jq -e '.[] | select(.id == "flowpay-core")' "$CONFIG_FILE" >/dev/null; then
    echo "ERROR: flowpay-core must not be present in the NEO Protocol ecosystem map"
    errors=$((errors + 1))
  fi
}

check_domain_format() {
  local bad_domains
  bad_domains="$(jq -r '.[] | select(.hosting.targetCustomDomain? and (.hosting.targetCustomDomain | test("^https?://"))) | "\(.id)\t\(.hosting.targetCustomDomain)"' "$CONFIG_FILE")"
  if [[ -n "$bad_domains" ]]; then
    echo "ERROR: targetCustomDomain must be host only (without protocol):"
    echo "$bad_domains" | awk -F'\t' '{printf "  - %s: %s\n", $1, $2}'
    errors=$((errors + 1))
  fi
}

check_required_fields() {
  local missing
  missing="$(jq -r '
    .[]
    | select(
      (.id | not) or
      (.org | not) or
      (.name | not) or
      (.localPath | not) or
      (.repository | not) or
      (.role | not) or
      (.hosting.platform | not)
    )
    | .id // "<missing-id>"
  ' "$CONFIG_FILE")"

  if [[ -n "$missing" ]]; then
    echo "ERROR: nodes missing required fields:"
    echo "$missing" | sed 's/^/  - /'
    errors=$((errors + 1))
  fi
}

check_local_paths() {
  local missing_paths=""
  while IFS=$'\t' read -r id local_path; do
    local target="$BASE_DIR/$local_path"
    if [[ ! -e "$target" ]]; then
      missing_paths+="$id"$'\t'"$target"$'\n'
    fi
  done < <(jq -r '.[] | [.id, .localPath] | @tsv' "$CONFIG_FILE")

  if [[ -n "$missing_paths" ]]; then
    echo "ERROR: localPath does not exist:"
    echo "$missing_paths" | awk -F'\t' 'NF==2 {printf "  - %s: %s\n", $1, $2}'
    errors=$((errors + 1))
  fi
}

check_duplicate_local_paths() {
  local unscoped_dups
  unscoped_dups="$(jq -r '
    group_by(.localPath)[]
    | select(length > 1)
    | if (all(has("workspaceScope"))) then empty
      else "\(. [0].localPath)\t\((map(.id) | join(", ")))"
      end
  ' "$CONFIG_FILE")"

  if [[ -n "$unscoped_dups" ]]; then
    echo "ERROR: shared localPath requires workspaceScope on all related nodes:"
    echo "$unscoped_dups" | awk -F'\t' '{printf "  - %s => %s\n", $1, $2}'
    errors=$((errors + 1))
  fi
}

show_scoped_duplicates() {
  local scoped
  scoped="$(jq -r '
    group_by(.localPath)[]
    | select(length > 1 and all(has("workspaceScope")))
    | "\(. [0].localPath)\t\((map(.id + "[" + .workspaceScope + "]") | join(", ")))"
  ' "$CONFIG_FILE")"
  if [[ -n "$scoped" ]]; then
    echo "INFO: scoped shared localPath:"
    echo "$scoped" | awk -F'\t' '{printf "  - %s => %s\n", $1, $2}'
  fi
}

require_unique_ids
ensure_flowpay_core_excluded
check_domain_format
check_required_fields
check_local_paths
check_duplicate_local_paths
show_scoped_duplicates

if [[ "$errors" -gt 0 ]]; then
  echo "FAILED: ecosystem validation found $errors error(s)"
  exit 1
fi

echo "OK: ecosystem validation passed"
