import { processDevOpsQuery } from '../src/terminal/engine/parser.js';
import { renderMarkdownToHTML } from '../src/terminal/engine/formatter.js';
import { contextManager } from '../src/terminal/engine/context.js';

console.log('================================================================');
console.log('   Senior DevOps Knowledge Assistant Comprehensive Test Suite   ');
console.log('================================================================\n');

const testCases = [
  // 1. Troubleshooting Scenarios
  {
    name: 'Troubleshoot CrashLoopBackOff',
    query: 'how to troubleshoot crashloopbackoff',
    expectedType: 'troubleshooting',
    mustInclude: ['Playbook', 'CrashLoopBackOff', 'kubectl describe pod', 'startupProbe', 'Exit Code 137']
  },
  {
    name: 'Troubleshoot 502 Bad Gateway',
    query: '502 bad gateway error on nginx alb',
    expectedType: 'troubleshooting',
    mustInclude: ['502 Bad Gateway', 'nginx', 'Keep-Alive', 'endpoints', 'curl']
  },
  {
    name: 'Troubleshoot 100% CPU Spike',
    query: 'server cpu is 100% load average high',
    expectedType: 'troubleshooting',
    mustInclude: ['100% CPU', 'top -H', 'jstack', 'HPA']
  },
  {
    name: 'Troubleshoot OOMKilled',
    query: 'pod terminated with oomkilled exit code 137',
    expectedType: 'troubleshooting',
    mustInclude: ['OOMKilled', '137', 'cgroup', 'limits.memory', 'MaxRAMPercentage']
  },
  {
    name: 'Troubleshoot Disk Full',
    query: 'disk space 100% full no space left on device',
    expectedType: 'troubleshooting',
    mustInclude: ['Disk Space', 'df -h', 'df -i', 'docker system prune', 'journalctl']
  },

  // 2. Architecture Blueprints
  {
    name: 'AWS 3-Tier HA Architecture',
    query: 'explain aws 3 tier architecture',
    expectedType: 'architecture',
    mustInclude: ['3-Tier', 'Route 53', 'CloudFront', 'Application Load Balancer', 'Aurora', 'NAT Gateway']
  },
  {
    name: 'DevSecOps Pipeline Architecture',
    query: 'devsecops pipeline architecture',
    expectedType: 'architecture',
    mustInclude: ['DevSecOps', 'Shift-Left', 'SonarQube', 'Trivy', 'Cosign', 'ArgoCD']
  },

  // 3. Interview Simulator
  {
    name: 'Senior DevOps Interview Question',
    query: 'interview',
    expectedType: 'interview',
    mustInclude: ['Interview Challenge', 'Question', 'Hint', 'Model Answer']
  },
  {
    name: 'Kubernetes Interview Question',
    query: 'interview k8s',
    expectedType: 'interview',
    mustInclude: ['KUBERNETES', 'Deployment', 'StatefulSet']
  },

  // 4. Comparisons
  {
    name: 'Docker vs Kubernetes Comparison',
    query: 'docker vs kubernetes',
    expectedType: 'comparison',
    mustInclude: ['Docker vs Kubernetes', 'Orchestration', 'Cargo ship', 'HPA']
  },
  {
    name: 'VM vs Container Comparison',
    query: 'vm vs container',
    expectedType: 'comparison',
    mustInclude: ['Virtual Machines vs Containers', 'Hypervisor', 'cgroups', 'Guest OS']
  },
  {
    name: 'Git Rebase vs Merge',
    query: 'rebase vs merge',
    expectedType: 'comparison',
    mustInclude: ['Git Rebase vs Git Merge', 'linear', 'Golden DevOps Rule']
  },
  {
    name: 'Terraform vs Ansible',
    query: 'terraform vs ansible',
    expectedType: 'comparison',
    mustInclude: ['Terraform vs Ansible', 'IaC', 'Configuration Management', 'Agentless']
  },

  // 5. Commands Deep-Dive
  {
    name: 'Command: kubectl get pods',
    query: 'kubectl get pods',
    expectedType: 'command',
    mustInclude: ['kubectl get pods', '-o wide', 'pitfalls', 'CrashLoopBackOff', 'IP']
  },
  {
    name: 'Command: docker ps',
    query: 'docker ps',
    expectedType: 'command',
    mustInclude: ['docker ps', '-a', 'CONTAINER ID', 'STATUS']
  },
  {
    name: 'Command: free -h',
    query: 'free -h',
    expectedType: 'command',
    mustInclude: ['free -h', 'buff/cache', 'available', 'Swap']
  },
  {
    name: 'Command: df -h',
    query: 'df -h',
    expectedType: 'command',
    mustInclude: ['df -h', 'inodes', 'Use%', 'Mounted on']
  },

  // 6. Hinglish Queries
  {
    name: 'Hinglish CrashLoop Question',
    query: 'pod crashloopbackoff kyu hota hai',
    expectedType: 'troubleshooting',
    mustInclude: ['CrashLoopBackOff']
  },
  {
    name: 'Hinglish K8s What is Question',
    query: 'kubernetes kya hai',
    expectedType: 'knowledge',
    mustInclude: ['Kubernetes']
  },
  {
    name: 'Hinglish Docker Optimization',
    query: 'docker image optimize kaise kare',
    expectedType: 'knowledge',
    mustInclude: ['Docker']
  },

  // 7. Portfolio Representation
  {
    name: 'Portfolio About Abhishek',
    query: 'who is abhishek',
    expectedType: 'portfolio',
    mustInclude: ['Abhishek Saini', 'DevOps', 'AbhishekSa74719']
  },
  {
    name: 'X / Twitter Profile Query',
    query: 'twitter',
    expectedType: 'portfolio',
    mustInclude: ['@AbhishekSa74719', 'x.com/AbhishekSa74719']
  },
  {
    name: 'Portfolio Skills Matrix',
    query: 'skills',
    expectedType: 'portfolio',
    mustInclude: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Prometheus']
  },
  {
    name: 'Portfolio Projects',
    query: 'projects',
    expectedType: 'portfolio',
    mustInclude: ['CI/CD Pipeline', 'Terraform', 'Prometheus']
  },
  {
    name: 'Portfolio Certifications',
    query: 'certifications',
    expectedType: 'portfolio',
    mustInclude: ['AWS', 'Certified']
  }
];

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  try {
    const res = processDevOpsQuery(tc.query);
    if (!res || !res.text) {
      console.error(`❌ [FAIL] ${tc.name}: Null or empty response returned.`);
      failed++;
      continue;
    }

    if (tc.expectedType && res.type !== tc.expectedType) {
      console.error(`❌ [FAIL] ${tc.name}: Expected type '${tc.expectedType}', got '${res.type}'.`);
      failed++;
      continue;
    }

    const missingWords = tc.mustInclude.filter(w => !res.text.toLowerCase().includes(w.toLowerCase()));
    if (missingWords.length > 0) {
      console.error(`❌ [FAIL] ${tc.name}: Response missing required keywords: [${missingWords.join(', ')}]`);
      failed++;
      continue;
    }

    const html = renderMarkdownToHTML(res.text);
    if (!html || html.length < 50) {
      console.error(`❌ [FAIL] ${tc.name}: Rendered HTML output too short.`);
      failed++;
      continue;
    }

    console.log(`✅ [PASS] ${tc.name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [ERROR] ${tc.name}:`, err.message);
    failed++;
  }
}

// 8. Test Contextual Memory Progression
console.log('\n--- Testing Conversational Context Progression ---');
try {
  contextManager.reset();
  const q1 = 'what is terraform state';
  const res1 = processDevOpsQuery(q1);
  console.log(`Turn 1: "${q1}" -> [${res1.type}] ${res1.title}`);

  const q2 = 'why do we need it?';
  const res2 = processDevOpsQuery(q2);
  console.log(`Turn 2 (Follow-up): "${q2}" -> [${res2.type}] ${res2.title}`);

  if (res2.type === 'knowledge' && res2.text.toLowerCase().includes('terraform')) {
    console.log('✅ [PASS] Contextual pronoun resolution verified.');
    passed++;
  } else {
    console.error('❌ [FAIL] Contextual pronoun failed to resolve to Terraform state.');
    failed++;
  }
} catch (err) {
  console.error('❌ [ERROR] Contextual testing:', err);
  failed++;
}

console.log('\n================================================================');
console.log(`Test Summary: ${passed} PASSED, ${failed} FAILED.`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
