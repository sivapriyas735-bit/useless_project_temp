/**
 * Synaptic Neural Network Particle Canvas
 * Renders floating, connecting neural nodes in the background.
 */

class SynapticNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.numNodes = 60;
    this.maxDistance = 140;
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.nodes = [];
    for (let i = 0; i < this.numNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.2,
        color: Math.random() > 0.5 ? 'rgba(0, 243, 255,' : 'rgba(188, 19, 254,'
      });
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      // Bounce off walls
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      // Mouse repulsion
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          node.x -= Math.cos(angle) * force * 1.5;
          node.y -= Math.sin(angle) * force * 1.5;
        }
      }

      // Draw node circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color + ' 0.8)';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = node.color + ' 0.8)';
      this.ctx.fill();

      // Draw connecting filaments
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.shadowBlur = 0;
          this.ctx.stroke();
        }
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SynapticNetwork('particlesCanvas');
});
