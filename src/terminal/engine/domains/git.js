/**
 * Git & GitHub Architecture Knowledge Module
 */

export const GIT_TOPICS = {
  rebase_vs_merge: {
    patterns: [
      'rebase vs merge', 'merge vs rebase', 'git rebase', 'git merge',
      'when to rebase', 'golden rule of rebase'
    ],
    title: "Git Rebase vs Git Merge: Mechanics & Trade-offs",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[VERSION CONTROL] Git Rebase vs Git Merge:</div>
  
  <div style="margin: 0.4rem 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
      <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 4px;">Aspect</th><th style="text-align: left; padding: 4px;">git merge</th><th style="text-align: left; padding: 4px;">git rebase</th></tr>
      <tr><td style="color:#38bdf8;"><strong>Commit History</strong></td><td>Preserves true chronological timeline; creates a merge commit.</td><td>Rewrites history linearly; re-applies commits onto new base.</td></tr>
      <tr><td style="color:#38bdf8;"><strong>Traceability</strong></td><td>Clear audit trail of when branches branched and merged.</td><td>Clean, linear <code>git log</code> graph without extra merge commits.</td></tr>
      <tr><td style="color:#38bdf8;"><strong>Safety</strong></td><td>Non-destructive; does not modify existing commit SHAs.</td><td>Destructive to commit IDs (changes parent SHAs).</td></tr>
    </table>
  </div>

  <div style="color: #cbd5e1; font-size: 0.84rem; margin-top: 0.4rem;">
    <strong style="color: #f59e0b;">The Golden Rule of Rebasing:</strong><br />
    <strong>Never rebase on a public shared branch</strong> (like <code>main</code> or <code>release</code>). Rebase local feature branches before submitting a Pull Request to keep upstream clean, but merge back to main.
  </div>

  <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.4rem;">
    <span style="color: #34d399;">Senior Recommended Workflow:</span> Pull upstream via <code>git pull --rebase origin main</code> on your feature branch, resolve conflicts incrementally, then open a clean PR.
  </div>
</div>
`
  },

  merge_conflicts: {
    patterns: [
      'resolve merge conflicts', 'merge conflict', 'how to fix merge conflict',
      'git conflict', 'conflict markers'
    ],
    title: "Resolving Git Merge Conflicts in Production Teams",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[GIT TROUBLESHOOTING] Step-by-Step Conflict Resolution:</div>
  <p>A merge conflict occurs when two branches modify the same lines of a file, or one branch deletes a file that another modified.</p>

  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #f59e0b; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # 1. Inspect which files have conflicts<br />
    git status<br /><br />
    # 2. Open conflicted file and inspect conflict markers:<br />
    &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (your branch)<br />
    const port = 8080;<br />
    =======<br />
    const port = 3000;<br />
    &gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/new-port (incoming branch)<br /><br />
    # 3. Edit file, remove markers, test build, then stage and commit:<br />
    git add &lt;resolved-file&gt;<br />
    git commit -m "fix(merge): resolve configuration conflict"
  </div>

  <div style="color: #cbd5e1; font-size: 0.82rem;">
    <strong style="color: #00f0ff;">Prevention Best Practice:</strong> Keep feature branches short-lived (&lt; 2-3 days) and rebase frequently against <code>origin/main</code>. Long-lived branches guarantee painful merge conflicts.
  </div>
</div>
`
  },

  git_push_internals: {
    patterns: [
      'what happens during git push', 'git push mechanics', 'git push explained',
      'how git push works'
    ],
    title: "Git Push Architecture & Mechanics",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[ARCHITECTURE] What Happens Under the Hood During 'git push':</div>
  <ol style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Reference Negotiation:</strong> Client and remote exchange advertised refs over SSH/HTTPS to calculate the missing commit graph.</li>
    <li><strong>Packfile Generation:</strong> Git bundles compressed blob, tree, and commit objects into a thin <em>packfile</em>.</li>
    <li><strong>Transmission & Unpacking:</strong> Packfile transmits over network; remote server indexes objects in <code>.git/objects/pack</code>.</li>
    <li><strong>Server-Side Hooks:</strong> The remote server executes <code>pre-receive</code> and <code>update</code> hooks (validating branch protection, commit signatures, CI rules).</li>
    <li><strong>Ref Update:</strong> Remote updates its branch pointer (e.g. <code>refs/heads/main</code>).</li>
    <li><strong>Post-Receive Trigger:</strong> Remote triggers <code>post-receive</code> hook (firing GitHub Webhooks to CI servers like Jenkins or GitHub Actions).</li>
  </ol>
</div>
`
  },

  repo_structure: {
    patterns: [
      'structure a devops repository', 'devops repo structure', 'iac repo structure',
      'monorepo vs polyrepo', 'gitops repo'
    ],
    title: "DevOps & IaC Repository Architecture",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[BEST PRACTICES] Structuring a Production DevOps Repository:</div>
  <p>For cloud and platform engineering, separate application code from infrastructure definition (GitOps principle):</p>
  
  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #00f0ff; font-family: monospace; font-size: 0.78rem; color: #34d399;">
    infra-repository/<br />
    ├── terraform/<br />
    │   ├── modules/ (reusable VPC, EKS, RDS blueprints)<br />
    │   └── environments/<br />
    │       ├── dev/ (main.tf, terraform.tfvars, backend.tf)<br />
    │       ├── staging/<br />
    │       └── prod/<br />
    ├── kubernetes/ (or Helm/Kustomize manifests)<br />
    │   ├── base/<br />
    │   └── overlays/ (dev, prod)<br />
    ├── .github/workflows/ (lint, trivy scan, plan/apply automation)<br />
    └── scripts/ (disaster recovery, maintenance utilities)
  </div>

  <div style="color: #cbd5e1; font-size: 0.82rem;">
    <strong>Trunk-Based vs GitFlow:</strong> Modern DevOps teams favor <strong>Trunk-Based Development</strong> with short-lived branches and feature flags, enabling high deployment frequency and eliminating GitFlow merge bottlenecks.
  </div>
</div>
`
  }
};
