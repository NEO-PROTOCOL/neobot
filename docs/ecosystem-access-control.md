# Ecosystem Access Control

## Objective
Guarantee that only authorized people can modify sovereign and restricted assets in the NEØ Protocol ecosystem.

## Baseline
- `config/ecosystem.json` is protected by validation and code ownership.
- `flowpay-core` must remain out of the ecosystem map.
- Core repositories must require CODEOWNERS review and branch protection on `main`.

## Enforced Components
1. `CODEOWNERS` in critical repositories:
   - `neobot`
   - `neo-nexus`
   - `mio-system`
   - `neo-protocol-contracts`
   - `neoflw-token`
2. GitHub Action:
   - `.github/workflows/ecosystem-guard.yml`
3. Validation script:
   - `scripts/validate-ecosystem.sh`
4. Access policy map:
   - `config/access-control.json`

## Apply Branch Protection
Run:

```bash
bash scripts/apply-branch-protection.sh
```

Requirements:
- `gh` authenticated with admin scope for the target repos.
- `main` branch exists in each repository.

## Operational Rule
No direct push to `main` in sovereign and restricted repositories.
All changes must pass checks and receive required CODEOWNERS approvals.
