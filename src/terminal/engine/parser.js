/**
 * DevOps Terminal Intelligence Engine - Unified Parser & Query Matcher
 */

import { contextManager } from './context.js';
import { LINUX_TOPICS } from './domains/linux.js';
import { GIT_TOPICS } from './domains/git.js';
import { DOCKER_TOPICS } from './domains/docker.js';
import { KUBERNETES_TOPICS } from './domains/kubernetes.js';
import { AWS_TOPICS } from './domains/aws.js';
import { TERRAFORM_TOPICS } from './domains/terraform.js';
import { CICD_JENKINS_TOPICS } from './domains/cicdJenkins.js';
import { DEVSECOPS_TOPICS } from './domains/devsecops.js';
import { observabilityKnowledge } from './domains/observabilitySre.js';
import { networkingKnowledge } from './domains/networking.js';
import { architectureKnowledge } from './domains/architecture.js';
import { troubleshootingKnowledge } from './domains/troubleshooting.js';
import { interviewQuestions } from './domains/interview.js';
import { comparisonMatrices } from './domains/comparisons.js';
import { commandKnowledge } from './domains/commands.js';
import { portfolioData } from '../../data/portfolioData.js';

// Helper to convert topic dictionaries ({ [id]: { patterns, title, content } }) to uniform array
function flattenTopics(topicObj, domainName) {
  if (!topicObj) return [];
  return Object.keys(topicObj).map(id => ({
    id: `${domainName}-${id}`,
    domain: domainName,
    title: topicObj[id].title,
    keywords: topicObj[id].patterns || [],
    content: topicObj[id].content
  }));
}

// Aggregate all knowledge domain topics
const allDomainTopics = [
  ...flattenTopics(LINUX_TOPICS, 'linux'),
  ...flattenTopics(GIT_TOPICS, 'git'),
  ...flattenTopics(DOCKER_TOPICS, 'docker'),
  ...flattenTopics(KUBERNETES_TOPICS, 'kubernetes'),
  ...flattenTopics(AWS_TOPICS, 'aws'),
  ...flattenTopics(TERRAFORM_TOPICS, 'terraform'),
  ...flattenTopics(CICD_JENKINS_TOPICS, 'cicd'),
  ...flattenTopics(DEVSECOPS_TOPICS, 'devsecops'),
  ...observabilityKnowledge.topics.map(t => ({ ...t, domain: 'observability' })),
  ...networkingKnowledge.topics.map(t => ({ ...t, domain: 'networking' })),
  ...architectureKnowledge.topics.map(t => ({ ...t, domain: 'architecture' }))
];

/**
 * Normalize input query (handling case, punctuation, shell prompts, and Hinglish phrases)
 */
export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') return '';
  let clean = query.trim().toLowerCase();
  clean = clean.replace(/^(\$|#|>|❯)\s*/, '');

  // Hinglish normalizations
  const hinglishMap = [
    { regex: /\bkya hai\b|\bkya hota hai\b|\bkise kehte hai\b/g, replace: 'what is' },
    { regex: /\bkaise kare\b|\bkaise karte hai\b|\bkaise hota hai\b/g, replace: 'how to' },
    { regex: /\bkyu hota hai\b|\bkyu aata hai\b|\bkyun\b/g, replace: 'why does' },
    { regex: /\bkaise fix kare\b|\btheek kaise kare\b|\bsolve kaise kare\b/g, replace: 'how to fix' },
    { regex: /\bsamjhao\b|\bbatao\b|\bbataiye\b/g, replace: 'explain' },
    { regex: /\bantar\b|\bfaark\b|\bdifference\b/g, replace: 'vs' },
    { regex: /\bkaise kaam karta hai\b/g, replace: 'how it works' }
  ];

  hinglishMap.forEach(item => {
    clean = clean.replace(item.regex, item.replace);
  });

  return clean.trim();
}

/**
 * Main query processor
 */
export function processDevOpsQuery(rawInput) {
  const normalized = normalizeQuery(rawInput);
  if (!normalized) {
    return {
      type: 'empty',
      text: 'Please enter a command or DevOps question. Type **help** to see available modules.'
    };
  }

  // 1. Check for Contextual Follow-ups (e.g. "why do we need it?", "how to fix it?", "compare them")
  const resolved = contextManager.resolveContextualQuery(normalized);
  const searchTarget = resolved.resolvedQuery;

  // 2. Help & Navigation Commands
  if (/^(help|\?|commands|menu|options)$/i.test(normalized)) {
    return getHelpResponse();
  }
  if (/^(modes|mode)$/i.test(normalized)) {
    return getModesResponse();
  }

  // 3. Interview Mode Trigger
  if (/\b(interview|mock interview|ask me a question|devops interview)\b/i.test(normalized)) {
    return getInterviewResponse(normalized);
  }

  // 4. Exact Command Matches (e.g. "df -h", "free -h", "kubectl get pods")
  const exactCmd = matchCommand(searchTarget);
  if (exactCmd && (exactCmd.name === searchTarget || exactCmd.aliases.some(a => searchTarget === a || searchTarget.startsWith(a + ' ')))) {
    contextManager.setTopic('command', exactCmd.id, exactCmd.name, [exactCmd.name, ...exactCmd.aliases]);
    return formatCommandResponse(exactCmd);
  }

  // 5. Production Troubleshooting Mode Trigger (Check early so incidents have highest priority)
  const tsMatch = matchTroubleshooting(searchTarget);
  if (tsMatch) {
    contextManager.setTopic('troubleshooting', tsMatch.id, tsMatch.title, tsMatch.keywords);
    return formatTroubleshootingResponse(tsMatch);
  }

  // 6. General Command Deep-Dives
  if (exactCmd) {
    contextManager.setTopic('command', exactCmd.id, exactCmd.name, [exactCmd.name, ...exactCmd.aliases]);
    return formatCommandResponse(exactCmd);
  }

  // 6. Architectural Comparisons (Docker vs K8s, VM vs Container, etc.)
  const compMatch = matchComparison(searchTarget);
  if (compMatch) {
    contextManager.setTopic('comparison', compMatch.id, compMatch.title, compMatch.keywords);
    return { type: 'comparison', title: compMatch.title, text: compMatch.content };
  }

  // 7. Abhishek Saini Portfolio Profile & Experience
  const portfolioMatch = matchPortfolio(searchTarget);
  if (portfolioMatch) {
    contextManager.setTopic('portfolio', portfolioMatch.id, portfolioMatch.title, [portfolioMatch.title]);
    return portfolioMatch;
  }

  // 8. Architecture Design Mode Trigger (matched if specific architecture query or blueprint requested)
  if (/\b(architecture|blueprint|3-tier|3 tier|topology|system design)\b/i.test(searchTarget)) {
    const archMatch = matchArchitecture(searchTarget);
    if (archMatch) {
      contextManager.setTopic('architecture', archMatch.id, archMatch.title, archMatch.keywords);
      return { type: 'architecture', title: archMatch.title, text: archMatch.content };
    }
  }

  // 9. DevOps Knowledge Domain Topics (Kubernetes, AWS, Linux, Terraform, Git, etc.)
  const topicMatch = matchDomainTopic(searchTarget);
  if (topicMatch) {
    contextManager.setTopic(topicMatch.domain || 'domain', topicMatch.id, topicMatch.title, topicMatch.keywords);
    return { type: 'knowledge', title: topicMatch.title, text: topicMatch.content };
  }

  // 10. Senior DevOps Fallback with Suggestions
  return getSeniorDevOpsFallback(rawInput);
}

/**
 * Match Troubleshooting Playbooks
 */
function matchTroubleshooting(q) {
  let bestScenario = null;
  let highestScore = 0;

  for (const scenario of troubleshootingKnowledge.scenarios) {
    for (const k of scenario.keywords) {
      if (q.includes(k)) {
        const score = k.length;
        if (score > highestScore) {
          highestScore = score;
          bestScenario = scenario;
        }
      }
    }
  }
  return bestScenario;
}

function formatTroubleshootingResponse(ts) {
  return {
    type: 'troubleshooting',
    title: ts.title,
    text: `### 🚨 Production Incident Playbook: ${ts.title}

---

#### 📌 Problem Description
${ts.problem}

#### 🔍 Root Cause Hypotheses
${ts.causes.map(c => `* ${c}`).join('\n')}

#### 🛠️ Diagnostic Workflow & Checks
${ts.diagnostics.map(d => `* ${d}`).join('\n')}

#### 💻 Diagnostic & Triage Commands
\`\`\`bash
${ts.commands.join('\n')}
\`\`\`

#### 🩹 Remediation & Fix Steps
${ts.fix.map(f => `* ${f}`).join('\n')}

#### 🛡️ Long-Term Prevention & Hardening
${ts.prevention.map(p => `* ${p}`).join('\n')}`
  };
}

/**
 * Match Architectural Blueprints
 */
function matchArchitecture(q) {
  for (const topic of architectureKnowledge.topics) {
    if (topic.keywords.some(k => q.includes(k))) {
      return topic;
    }
  }
  // Only default to 3-tier AWS if the query explicitly is a generic architecture question
  if (/^(architecture|cloud architecture|system architecture|infra architecture|infrastructure architecture|system design)$/i.test(q.trim())) {
    return architectureKnowledge.topics[0];
  }
  return null;
}

/**
 * Match Architectural Comparisons
 */
function matchComparison(q) {
  for (const comp of comparisonMatrices) {
    if (comp.keywords.some(k => q.includes(k))) {
      return comp;
    }
  }
  return null;
}

/**
 * Match Command References
 */
function matchCommand(q) {
  for (const cmd of commandKnowledge.commands) {
    if (q === cmd.name || cmd.aliases.some(a => q === a || q.startsWith(a + ' '))) {
      return cmd;
    }
    if (q.includes(cmd.name)) {
      return cmd;
    }
  }
  return null;
}

function formatCommandResponse(cmd) {
  return {
    type: 'command',
    title: cmd.name,
    text: `### 💻 Command Deep-Dive: \`${cmd.name}\`

${cmd.description}

---

#### 📋 Syntax
\`\`\`bash
${cmd.syntax}
\`\`\`

#### ⚙️ Important Flags & Options
${cmd.flags.map(f => `* \`${f.flag}\`: ${f.desc}`).join('\n')}

#### ⚠️ Common Pitfalls & Mistakes
${cmd.pitfalls.map(p => `* ${p}`).join('\n')}

#### 🖥️ Realistic Simulated Output
\`\`\`text
${cmd.simulation}
\`\`\``
  };
}

/**
 * Match Domain Knowledge Topics
 */
function matchDomainTopic(q) {
  let bestTopic = null;
  let highestScore = 0;

  for (const topic of allDomainTopics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  return highestScore > 0 ? bestTopic : null;
}

/**
 * Match Portfolio Data
 */
function matchPortfolio(q) {
  const bio = portfolioData.hero || portfolioData.personal;
  const exp = portfolioData.experience;
  const projs = portfolioData.projects;
  const certs = portfolioData.certifications;

  if (/\b(who is abhishek|abhishek|about|profile|bio|creator|author)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-bio',
      title: 'About Abhishek Saini',
      text: `### 👨‍💻 ${bio.name} — ${bio.title}

* **Role**: ${bio.subtitle || bio.title}
* **Location**: ${bio.location || 'India'}
* **Status**: ${bio.badge || 'Open to Opportunities'}
* **Email**: ${bio.email || 'abhishek.sainiii@outlook.com'}
* **GitHub**: [github.com/Abhisheksaini1208](${bio.github || 'https://github.com/Abhisheksaini-git'})
* **LinkedIn**: [linkedin.com/in/abhisheksaini1208](${bio.linkedin || 'https://www.linkedin.com/in/abhisheksaini-devops/'})
* **X / Twitter**: [@AbhishekSa74719](${bio.x || 'https://x.com/AbhishekSa74719'})

> "${bio.description || bio.bio}"`
    };
  }

  if (/\b(skills|tech stack|technologies|tools)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-skills',
      title: 'Technical Skills Matrix',
      text: `### 🛠️ Abhishek Saini — Core Technical Stack

* **Cloud & Infrastructure**: AWS (EC2, VPC, S3, IAM, CloudFront, Route53, EKS, ECS, Lambda)
* **DevOps & IaC**: Kubernetes, Docker, Terraform, Ansible, Vagrant
* **CI/CD & GitOps**: Jenkins, GitHub Actions, GitLab CI, ArgoCD
* **Observability & SRE**: Prometheus, Grafana, Datadog, ELK/EFK Stack
* **Security & DevSecOps**: Trivy, SonarQube, Gitleaks, OWASP, HashiCorp Vault
* **Scripting & Linux**: Bash, Python, Linux Kernel/SysAdmin, Networking`
    };
  }

  if (/\b(experience|work history|career|company|job)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-experience',
      title: 'Work Experience',
      text: `### 💼 Professional Experience — Abhishek Saini

${(exp || []).map(e => `#### ${e.role} @ **${e.company}** (${e.period})
* *Location*: ${e.location}
${(e.highlights || []).map(h => `* ${h}`).join('\n')}`).join('\n\n')}`
    };
  }

  if (/\b(projects|case studies|showcase|portfolio projects)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-projects',
      title: 'Key Infrastructure Projects',
      text: `### 🚀 Production DevOps Projects — Abhishek Saini

${(projs || []).map((p, i) => `**${i+1}. ${p.title}**
* *Category*: ${p.badge || p.category || 'Production DevOps'}
* *Description*: ${p.description}
* *Stack*: ${(p.tags || p.technologies || []).join(', ')}
* *Impact*: ${(p.highlights || []).join('; ') || 'Production Ready'}`).join('\n\n')}

* **Production Observability Stack**: Prometheus, Grafana, Node Exporter, Alertmanager for real-time cluster telemetry.`
    };
  }

  if (/\b(certifications|certs|certified|aws certified)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-certs',
      title: 'Certifications & Accreditations',
      text: `### 📜 Professional Certifications & Accreditations

* **AWS Certified Cloud Practitioner** — Amazon Web Services (AWS)
* **DevOps Engineering & Automation Masterclass** — Linux, Docker & K8s
* **Docker & Kubernetes for Production Microservices** — CNCF Architecture
* **Infrastructure as Code with Terraform** — HashiCorp Cloud IaC`
    };
  }

  if (/\b(contact|email|reach|hire|message)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-contact',
      title: 'Contact Information',
      text: `### 📬 Connect with Abhishek Saini

* **Email**: ${bio.email || 'abhishek.sainiii@outlook.com'}
* **LinkedIn**: ${bio.linkedin || 'https://www.linkedin.com/in/abhisheksaini-devops/'}
* **GitHub**: ${bio.github || 'https://github.com/Abhisheksaini-git'}
* **X / Twitter**: ${bio.x || 'https://x.com/AbhishekSa74719'} (@AbhishekSa74719)
* Open to Cloud Engineer, DevOps Engineer, and SRE roles.`
    };
  }

  if (/\b(x|twitter|tweet|x\.com|@abhisheksa74719)\b/i.test(q)) {
    return {
      type: 'portfolio',
      id: 'abhishek-x',
      title: 'X / Twitter Profile',
      text: `### 🐦 X (Twitter) — Abhishek Saini

* **Handle**: [@AbhishekSa74719](https://x.com/AbhishekSa74719)
* **Profile URL**: [https://x.com/AbhishekSa74719](https://x.com/AbhishekSa74719)
* Connect on X for Cloud Architecture insights, Kubernetes tips, and DevOps automation discussions.`
    };
  }

  return null;
}

/**
 * Handle Interview Question Mode
 */
let interviewIdx = 0;
function getInterviewResponse(q) {
  const normQ = q.replace(/\bk8s\b/g, 'kubernetes');
  const specific = interviewQuestions.find(iq => normQ.includes(iq.category));
  const selected = specific || interviewQuestions[interviewIdx % interviewQuestions.length];
  interviewIdx++;

  return {
    type: 'interview',
    title: `Interview Challenge: ${selected.category.toUpperCase()}`,
    text: `### 🎯 Senior DevOps Interview Challenge [${selected.category.toUpperCase()}]

**Question**:
${selected.question}

---

💡 **Hint**: ${selected.hint}

<details>
<summary>▶ Click to reveal Senior Engineer Model Answer</summary>

${selected.answer}

</details>

---
*Type \`interview\` again for the next technical scenario.*`
  };
}

/**
 * General Help Guide
 */
function getHelpResponse() {
  return {
    type: 'help',
    text: `### ⚡ Senior DevOps & Cloud Architecture Terminal Assistant

Welcome to Abhishek Saini's interactive DevOps Terminal. You can interact via standard commands, natural language, or incident scenarios.

---

#### 🛠️ Available Modes & Workflows:
1. **Production Troubleshooting Mode**:
   - \`crashloopbackoff\` — Diagnosing failing Kubernetes pods
   - \`502 bad gateway\` — Upstream reverse proxy & connection debugging
   - \`100% cpu\` — Linux process thread dump & runaway queries
   - \`oomkilled\` — Exit code 137, cgroups & memory limits
   - \`disk full\` — Inode exhaustion, Docker cache & logrotate

2. **Architectural Blueprints & Topologies**:
   - \`aws architecture\` — Multi-AZ HA 3-tier production VPC
   - \`devsecops pipeline\` — Shift-left CI/CD with security gates
   - \`kubernetes architecture\` — Ingress, Karpenter & multi-tenant nodes

3. **Technical Comparisons**:
   - \`docker vs kubernetes\`
   - \`vm vs container\`
   - \`rebase vs merge\`
   - \`terraform vs ansible\`

4. **Senior Interview Simulator**:
   - Type \`interview\` or \`interview k8s\` for senior technical challenges.

5. **DevOps Commands & Simulations**:
   - \`kubectl get pods\`, \`docker ps\`, \`free -h\`, \`df -h\`, \`ss -tulpn\`

6. **Portfolio Navigation**:
   - \`about\`, \`skills\`, \`projects\`, \`experience\`, \`contact\``
  };
}

function getModesResponse() {
  return {
    type: 'modes',
    text: `### 🧭 Specialized Assistant Modes

* **\`troubleshoot\`**: Interactive diagnostic playbooks for 502, CrashLoop, OOMKilled, CPU spikes.
* **\`interview\`**: Technical interview simulator with hints and senior-level answers.
* **\`architecture\`**: Production cloud topologies with ASCII diagrams.
* **\`commands\`**: Command deep-dives with flags, pitfalls, and realistic outputs.
* **\`portfolio\`**: Abhishek's real-world projects, skills, and experience.`
  };
}

/**
 * Fallback with contextual suggestions
 */
function getSeniorDevOpsFallback(rawQuery) {
  return {
    type: 'fallback',
    text: `### 💡 DevOps Engineer Assistant

I couldn't locate an exact match for \`"${rawQuery}"\`. 

As a Senior DevOps & Cloud Architect assistant, I can help you with:
* **Production Incident Diagnostics** (e.g. *CrashLoopBackOff*, *502 Bad Gateway*, *OOMKilled*)
* **Architecture Topologies** (e.g. *AWS 3-Tier HA*, *DevSecOps Pipeline*, *EKS Cluster*)
* **Core DevOps Concepts** (e.g. *Docker vs Kubernetes*, *Terraform remote state*, *Prometheus pull model*)
* **Simulated Commands** (e.g. *kubectl get pods*, *docker ps*, *free -h*)
* **Abhishek Saini's Profile** (e.g. *skills*, *projects*, *experience*, *contact*)

Try asking:
> \`how to troubleshoot crashloopbackoff\`  
> \`explain aws 3 tier architecture\`  
> \`docker vs kubernetes\`  
> \`interview\``
  };
}
