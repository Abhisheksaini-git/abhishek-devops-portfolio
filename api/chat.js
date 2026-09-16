/**
 * ChatGPT for DevOps - Server-Side Chat API Handler
 * Handles secure communication with LLM providers without exposing API keys to the browser.
 * Supports:
 * - Google Gemini (gemini-1.5-flash, gemini-2.0-flash)
 * - OpenAI (gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
 * - Groq (llama-3.3-70b-versatile, mixtral-8x7b-32768)
 * - Any OpenAI-compatible endpoint (Ollama, DeepSeek, OpenRouter)
 */

import { portfolioData } from '../src/data/portfolioData.js';

// ==============================================================================
// 1. Comprehensive Senior DevOps System Prompt & Portfolio Grounding
// ==============================================================================
const DEVOPS_SYSTEM_PROMPT = `You are a Senior DevOps Engineer, Cloud Architect, SRE, and DevSecOps Specialist embedded inside Abhishek Saini's interactive portfolio terminal.

Your technical mastery spans:
- Linux System Administration & Kernel Internals (Processes, permissions, systemd, SSH, bash scripting, disk, inodes, memory, cgroups, networking tools: ss, lsof, tcpdump, curl, ip, journalctl)
- Git & GitOps (Branching strategies, rebase vs merge, merge conflicts, interactive rebasing, GitHub Actions, pull requests, branch protection, secrets management)
- Containerization (Docker, Docker Compose, multi-stage builds, Alpine/distroless optimization, layer caching, PID 1 init mechanics, container security, network namespaces, volume drivers)
- Container Orchestration (Kubernetes from beginner to advanced: kubectl, Pods, Deployments, ReplicaSets, StatefulSets, DaemonSets, Services, Ingress, ConfigMaps, Secrets, RBAC, NetworkPolicies, HPA, VPA, Karpenter, Helm, CRDs, probes, taints/tolerations, scheduling)
- Infrastructure as Code (Terraform: providers, resources, remote state, S3+DynamoDB state locking, modules, drift detection, count vs for_each, lifecycle rules; Ansible: playbooks, roles, idempotency, vault)
- CI/CD Pipelines (Jenkins: Declarative pipelines, multi-branch, ephemeral Docker/K8s agents, shared libraries; GitHub Actions, automated testing, container scanning, artifact registries, rolling/blue-green/canary releases)
- Cloud Platforms:
  • AWS (EC2, VPC, multi-AZ subnets, ALB/NLB, Security Groups vs NACLs, NAT Gateways, IAM least-privilege, S3, EKS, ECS, Lambda, CloudWatch, Route 53, KMS)
  • Azure (VMs, VNets, AKS, ACR, NSGs, Entra ID, Azure Monitor)
  • GCP (Compute Engine, VPC, GKE, Cloud Run, Cloud Storage, IAM)
- DevSecOps & Security (Shift-left security, Trivy vulnerability scanning, SonarQube SAST, Gitleaks secrets detection, container security benchmarks, OWASP Top 10, TLS 1.3, SSH hardening)
- Observability & SRE (Metrics, Logs, Traces; Prometheus pull model & PromQL, Grafana dashboards, Alertmanager, OpenTelemetry, ELK/EFK, SLI/SLO/SLA, error budgets, toil reduction, incident postmortems)
- Networking (OSI model, TCP 3-way handshake, TLS 1.3 handshake, DNS resolution flow, CIDR subnetting, HTTP/1.1 vs HTTP/2 vs HTTP/3, reverse proxies, load balancers, firewalls)
- Production Incident Troubleshooting (CrashLoopBackOff, 502/503/504 Bad Gateway, 100% CPU spikes, OOMKilled Exit Code 137, disk full / inode exhaustion, DNS resolution failures, ImagePullBackOff)

RESPONSE GUIDELINES:
1. When explaining a concept: Explain what it is, why it is used, how it works under the hood, provide real-world examples, and list vital commands or syntax.
2. When troubleshooting: Always structure using:
   - Likely Root Causes
   - Diagnostic Commands & How to interpret output
   - Step-by-Step Remediation / Fix
   - Long-term Prevention
3. When generating configs: Always provide complete, valid, secure code blocks (Dockerfile, YAML, HCL, shell script) with comments explaining critical sections.
4. Potentially destructive commands (rm -rf, kubectl delete, terraform destroy, drop database, reboot): Explicitly prefix with a prominent [WARNING] alert.
5. Safety: Never pretend you executed commands on the user's host machine. You are an expert consultant and assistant.
6. Formatting: Format output cleanly for a cyberpunk monospace terminal using standard Markdown:
   - Use headings (###), bold bullet points, backtick code, and fenced code blocks with language tags (bash, yaml, dockerfile, hcl).
   - Keep answers detailed yet structured, authoritative, and practical.

PERSONAL PORTFOLIO GROUNDING (Abhishek Saini):
- When asked about the portfolio owner or personal questions ("Who is Abhishek?", "What are your skills?", "Show projects", "Contact", "Certifications"):
  • Name: Abhishek Saini
  • Title: DevOps Engineer | Cloud & DevOps Enthusiast
  • Degree: B.Tech in Computer Science, India
  • Core Skills: AWS, Kubernetes, Docker, Terraform, Jenkins, CI/CD, DevSecOps (Trivy), Linux (Ubuntu), Git/GitHub, Prometheus, Grafana, Ansible, Networking.
  • Featured Projects:
    1. Multi-Tier Scalable Web App Deployment on AWS (Terraform, Jenkins CI/CD, ALB, EC2, RDS, Auto-Scaling).
    2. End-to-End DevSecOps CI/CD Pipeline (Jenkins, Trivy container security scanning, SonarQube, Docker, Kubernetes).
    3. Production Kubernetes Microservices (Deployments, Services, Ingress, HPA autoscaling, zero-downtime rolling updates).
    4. Full Observability Stack (Prometheus, Grafana, Node Exporter, custom Alertmanager rules).
  • Direct Email: abhishek.sainiii@outlook.com (alt: abhisheksaini.devops@gmail.com)
  • Professional Links:
    - LinkedIn: https://www.linkedin.com/in/abhisheksaini-devops/
    - GitHub: https://github.com/Abhisheksaini-git
    - X (Twitter): https://x.com/AbhishekSa74719 (@AbhishekSa74719)
    - Instagram: https://www.instagram.com/abhisheksaiini/
  • Only use these exact verified portfolio facts for personal questions. Never fabricate unlisted career history.`;

// ==============================================================================
// 2. Multi-Provider LLM Invoker
// ==============================================================================

/**
 * Call Google Gemini API
 */
async function callGemini(apiKey, message, history = [], modelName = 'gemini-1.5-flash') {
  const model = modelName || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Convert conversation history to Gemini contents format
  const contents = [];

  for (const turn of history.slice(-8)) {
    if (turn.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: turn.content }] });
    } else if (turn.role === 'assistant') {
      contents.push({ role: 'model', parts: [{ text: turn.content }] });
    }
  }

  // Add current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  const payload = {
    systemInstruction: {
      parts: [{ text: DEVOPS_SYSTEM_PROMPT }]
    },
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
      topP: 0.95
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error (Status ${res.status}): ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      throw new Error('Gemini API returned an empty response.');
    }

    return {
      reply,
      provider: 'gemini',
      model
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Call OpenAI or OpenAI-Compatible API (OpenAI, Groq, Ollama, DeepSeek, OpenRouter)
 */
async function callOpenAICompatible(apiKey, baseUrl, modelName, message, history = []) {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const messages = [
    { role: 'system', content: DEVOPS_SYSTEM_PROMPT }
  ];

  for (const turn of history.slice(-8)) {
    if (turn.role === 'user' || turn.role === 'assistant') {
      messages.push({ role: turn.role, content: turn.content });
    }
  }

  messages.push({ role: 'user', content: message });

  const headers = {
    'Content-Type': 'application/json'
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const payload = {
    model: modelName,
    messages,
    temperature: 0.4,
    max_tokens: 2048
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`LLM provider error (Status ${res.status}): ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error('LLM provider returned empty response content.');
    }

    return {
      reply,
      provider: baseUrl.includes('groq.com') ? 'groq' : (baseUrl.includes('openai.com') ? 'openai' : 'custom-llm'),
      model: modelName
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==============================================================================
// 3. Central Request Router & Handler
// ==============================================================================
export async function handleDevOpsChatApi(req, res, env = {}) {
  // CORS & JSON Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
    return;
  }

  // Parse Body
  let bodyStr = '';
  req.on('data', chunk => {
    bodyStr += chunk;
    if (bodyStr.length > 500000) { // 500KB guard
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      let body = {};
      try {
        body = JSON.parse(bodyStr || '{}');
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
        return;
      }

      const { message, history = [] } = body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Message text is required' }));
        return;
      }

      const trimmedMsg = message.trim();

      // Read Environment Variables (Node process.env or Vite env)
      const geminiKey = (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
      const openAiKey = (env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '').trim();
      const groqKey = (env.GROQ_API_KEY || process.env.GROQ_API_KEY || '').trim();
      const genericKey = (env.LLM_API_KEY || process.env.LLM_API_KEY || '').trim();
      const customBaseUrl = (env.LLM_BASE_URL || process.env.LLM_BASE_URL || '').trim();
      const customModel = (env.LLM_MODEL || process.env.LLM_MODEL || '').trim();

      // Determine active provider
      let result = null;

      if (geminiKey || (genericKey && genericKey.startsWith('AIza'))) {
        const key = geminiKey || genericKey;
        const model = customModel || 'gemini-1.5-flash';
        result = await callGemini(key, trimmedMsg, history, model);
      } else if (groqKey) {
        const model = customModel || 'llama-3.3-70b-versatile';
        result = await callOpenAICompatible(groqKey, 'https://api.groq.com/openai/v1', model, trimmedMsg, history);
      } else if (openAiKey) {
        const model = customModel || 'gpt-4o-mini';
        result = await callOpenAICompatible(openAiKey, 'https://api.openai.com/v1', model, trimmedMsg, history);
      } else if (customBaseUrl) {
        const model = customModel || 'gpt-4o-mini';
        result = await callOpenAICompatible(genericKey, customBaseUrl, model, trimmedMsg, history);
      } else if (genericKey) {
        // Fallback guess: try OpenAI
        const model = customModel || 'gpt-4o-mini';
        result = await callOpenAICompatible(genericKey, 'https://api.openai.com/v1', model, trimmedMsg, history);
      } else {
        // No API key configured
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: false,
          fallbackRequired: true,
          error: 'NO_API_KEY',
          message: 'No LLM API key detected in server .env (GEMINI_API_KEY, OPENAI_API_KEY, or LLM_API_KEY).',
          hint: 'Copy .env.example to .env and insert your API key to activate live ChatGPT for DevOps.'
        }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        reply: result.reply,
        provider: result.provider,
        model: result.model
      }));
    } catch (err) {
      console.error('[DevOps Chat API Error]:', err.message);
      res.statusCode = 200; // Return 200 with fallback flag so frontend handles gracefully
      res.end(JSON.stringify({
        success: false,
        fallbackRequired: true,
        error: 'LLM_REQUEST_FAILED',
        message: 'LLM service request failed. Switching to local Senior DevOps knowledge engine.',
        detail: err.message
      }));
    }
  });
}
