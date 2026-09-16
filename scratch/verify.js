import http from 'http';

http.get('http://localhost:5173/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const tools = ['AWS', 'Terraform', 'Jenkins', 'Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'Git', 'GitHub', 'GitLab', 'Ansible', 'Linux'];
    for (const t of tools) {
      const match = data.includes(`<span class="tool-name">${t}</span>`);
      console.log(`${t}: ${match ? 'OK' : 'MISSING'}`);
    }
  });
}).on('error', err => console.error(err));
