/**
 * Observability, Monitoring & SRE Knowledge Domain
 */

export const observabilityKnowledge = {
  domain: 'observability',
  topics: [
    {
      id: 'pillars-of-observability',
      title: 'Three Pillars of Observability: Metrics vs Logs vs Traces',
      keywords: ['observability', 'metrics', 'logs', 'traces', 'telemetry', 'opentelemetry', 'pillars', 'monitoring'],
      summary: 'Observability answers WHY a system is broken, unlike monitoring which just tells you IF it is broken.',
      content: `### 🔭 The Three Pillars of Modern Observability & OpenTelemetry

Observability is the degree to which you can infer the internal states of a system based on its external outputs.

---

#### 1. Metrics (Aggregatable Numbers over Time)
* **What**: Timestamped numeric measurements (Counters, Gauges, Histograms, Summaries).
* **Characteristics**: Highly compressible, cheap to store, ideal for alerts, dashboards, and trend analysis.
* **Stack**: Prometheus, VictoriaMetrics, M3DB, Datadog, Grafana.
* **Limitation**: Cardinality explosion (too many unique labels like \`user_id\` or \`ip\` will crash TSDBs).

#### 2. Logs (Structured Event Records)
* **What**: Discrete records of events with timestamp and context (JSON structured logs).
* **Characteristics**: Rich diagnostic detail for specific errors, exceptions, and stack traces.
* **Stack**: FluentBit / Logstash (shippers), Loki / Elasticsearch / OpenSearch (storage & query).
* **Best Practice**: Always log in JSON with standard fields (\`timestamp\`, \`level\`, \`service\`, \`trace_id\`, \`span_id\`, \`message\`).

#### 3. Traces (Distributed Request Flow)
* **What**: End-to-end journey of a single user transaction traversing multiple microservices.
* **Components**: **Trace ID** (whole request) and **Span IDs** (individual hops/operations with duration and metadata).
* **Stack**: OpenTelemetry (OTel Collector/SDKs), Jaeger, Grafana Tempo, AWS X-Ray.
* **Value**: Instantly pinpoint which microservice, database query, or downstream API caused latency spikes.

---

### 💡 Modern Industry Standard: OpenTelemetry (OTel)
Never vendor-lock into proprietary agents. Instrument apps using OpenTelemetry SDKs, emit to an OTel Collector, and export to any backend (Prometheus, Loki, Tempo, Datadog).`
    },
    {
      id: 'sli-slo-sla-error-budget',
      title: 'SRE Fundamentals: SLI vs SLO vs SLA & Error Budget Management',
      keywords: ['sli', 'slo', 'sla', 'error budget', 'sre', 'reliability', 'service level', 'availability'],
      summary: 'SLI is what you measure, SLO is your target, SLA is your legal contract, and Error Budget is your innovation allowance.',
      content: `### 🎯 SRE Core Framework: SLI vs SLO vs SLA & Error Budgets

In Google Site Reliability Engineering (SRE), reliability is not assumed to be 100%—because 100% is neither achievable nor cost-effective.

---

| Concept | Definition | Example in Production | Stakeholders |
| :--- | :--- | :--- | :--- |
| **SLI** (Service Level Indicator) | A carefully defined metric representing service performance | \`Successful requests / Total requests\` (HTTP 2xx & 3xx vs all) | SRE / DevOps / Developers |
| **SLO** (Service Level Objective) | Internal target agreed upon by engineering and product | 99.9% of requests succeed with latency < 200ms over rolling 30 days | SRE, Devs, Product Managers |
| **SLA** (Service Level Agreement) | External contractual commitment to customers with financial consequences | 99.5% uptime per month or 10% bill credit penalty | Legal, Sales, Customers |
| **Error Budget** | The allowed unreliability: \`100% - SLO\` | For 99.9% SLO: 0.1% downtime permitted (~43.8 minutes/month) | Joint Dev & SRE release gate |

---

### ⚖️ How to Manage Error Budgets in Real Life:
1. **Green (Budget > 20% remaining)**: Ship features fast, conduct chaos engineering tests.
2. **Yellow (Budget 5-20% remaining)**: Slow down non-critical deploys, review recent incidents.
3. **Red (Budget Depleted / 0% remaining)**: **Deployment Freeze** on new features. 100% dev team effort shifts to bug fixes, technical debt, and reliability engineering until the rolling window recovers.`
    },
    {
      id: 'prometheus-architecture',
      title: 'Prometheus Architecture: Pull vs Push, TSDB, & Alertmanager',
      keywords: ['prometheus', 'grafana', 'promql', 'pull model', 'pushgateway', 'alertmanager', 'tsdb'],
      summary: 'Prometheus uses a scrape (pull) model to collect metrics from HTTP /metrics endpoints, stores in TSDB, and routes alerts via Alertmanager.',
      content: `### 📈 Prometheus Deep-Dive: Architecture & Scraping Model

Prometheus is the de facto CNCF monitoring system built around a multi-dimensional time-series data model and PromQL.

---

### 🔄 Why Pull Model over Push Model?
* **Health Monitoring Built-in**: If Prometheus fails to scrape an endpoint, the target is automatically marked \`UP=0\` (down).
* **Decoupled Architecture**: Applications don't need to know where the monitoring server lives; they simply expose a lightweight \`/metrics\` HTTP endpoint.
* **Rate Limiting & Protection**: The scraper controls scrape frequency (\`scrape_interval: 15s\`), preventing production servers from being overwhelmed by metric pushes during high traffic.
* *When is Push used?* Short-lived batch jobs or AWS Lambda functions push to **Prometheus Pushgateway**, which Prometheus then scrapes.

---

### ⚙️ Core Architecture Components:
1. **Prometheus Server**:
   - **Retrieval Worker**: Scrapes targets discovered via Service Discovery (K8s API, Consul, AWS EC2 tags).
   - **TSDB (Time Series Database)**: Appends data in 2-hour blocks in memory, then flushes to disk with Gorilla-style compression.
   - **PromQL Engine**: Evaluates alert rules and queries.
2. **Alertmanager**: Deduplicates, groups, mutes, and routes alerts to Slack, PagerDuty, or Email.
3. **Grafana**: Visualizes metrics through pre-built and custom dashboards via PromQL queries.`
    },
    {
      id: 'alerting-best-practices',
      title: 'Senior SRE Alerting: Symptom-Based vs Cause-Based Alerting',
      keywords: ['alerting', 'alert fatigue', 'pagerduty', 'alertmanager', 'best practices', 'runbook'],
      summary: 'Alert on symptoms affecting users (errors, latency), not causes (CPU, memory). Every alert must be actionable.',
      content: `### 🚨 Senior SRE Alerting Best Practices & Combating Alert Fatigue

Rule of thumb: **If an engineer gets paged at 3:00 AM, there must be user impact AND an immediate action required.**

---

### ❌ Cause-Based Alerting (Anti-Pattern):
* "Server-01 CPU is 92%" ➔ *Result: Engineer wakes up, server is happily processing batch queue, goes back to sleep annoyed.*
* Leads to **Alert Fatigue**: engineers ignore alerts or mute channels.

### ✅ Symptom-Based Alerting (Best Practice):
* "Checkout Service Error Rate > 2% for 5 minutes"
* "API P99 Latency > 1.5s affecting 10% of users"
* "Error budget burn rate exceeds 14x over 1 hour"

---

### 🛡️ The 4 Golden Signals (Google SRE):
1. **Latency**: Time taken to service a request (track P50, P90, P99, not averages).
2. **Traffic**: Demand placed on system (HTTP requests/sec, concurrent transactions).
3. **Errors**: Rate of failed requests (HTTP 5xx, failed queries).
4. **Saturation**: How full the service is (memory, disk I/O, connection pool utilization).`
    }
  ]
};
