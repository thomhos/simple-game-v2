import { RenderContext } from '../types';
import { DefaultScene } from './default';

interface IntroSceneState {
    startTime: number;
    particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        life: number;
    }>;
}

export class IntroScene extends DefaultScene<IntroSceneState> {
    name = 'intro';

    localState: IntroSceneState = {
        startTime: 0,
        particles: [],
    };

    onEnter() {
        super.onEnter();
        // Reset intro state when entering
        if (this.localState) {
            this.localState.startTime = 0; // Will be set in first update
            this.localState.particles = [];
        }
    }

    update() {
        super.update();
        const state = this.store.getState();

        if (this.transitionType !== 'none') return;

        // Initialize start time when first entering
        if (this.localState!.startTime === 0) {
            this.localState!.startTime = state.gameTime;
            this.initializeParticles();
        }

        // Auto-transition after 5 seconds
        const elapsed = state.gameTime - this.localState!.startTime;
        if (elapsed >= 5000) {
            this.changeScene('stage-select');
            return;
        }

        // Update particles
        this.updateParticles(state.fixedTimeStep);

        // Allow manual skip with Enter
        if (state.input.keysPressed.includes('Enter')) {
            this.changeScene('stage-select');
        }
    }

    initializeParticles() {
        const colors = [
            '#ff6b6b',
            '#4ecdc4',
            '#45b7d1',
            '#f9ca24',
            '#f0932b',
            '#eb4d4b',
            '#6c5ce7',
        ];
        this.localState!.particles = [];

        for (let i = 0; i < 50; i++) {
            this.localState!.particles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: Math.random() * 2 + 1,
            });
        }
    }

    updateParticles(deltaTime: number) {
        const dt = deltaTime / 1000; // Convert to seconds

        this.localState!.particles.forEach((particle) => {
            // Update position
            particle.x += particle.vx * dt * 100;
            particle.y += particle.vy * dt * 100;

            // Wrap around screen edges
            if (particle.x < 0) particle.x = 800;
            if (particle.x > 800) particle.x = 0;
            if (particle.y < 0) particle.y = 600;
            if (particle.y > 600) particle.y = 0;

            // Update life (for pulsing effect)
            particle.life += dt * 2;
        });
    }

    render(renderContext: RenderContext) {
        super.render(renderContext);

        const { ctx, state } = renderContext;
        const { canvas } = ctx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Calculate fade effect based on transition state
        let opacity = 1;
        if (this.transitionType === 'in') {
            opacity = this.transitionProgress;
        } else if (this.transitionType === 'out') {
            opacity = 1 - this.transitionProgress;
        }

        // Apply fade effect to entire scene
        ctx.save();
        ctx.globalAlpha = opacity;

        // Calculate progress (0 to 1 over 5 seconds)
        // Handle case where startTime hasn't been set yet
        const elapsed =
            this.localState!.startTime === 0 ? 0 : state.gameTime - this.localState!.startTime;
        const progress = Math.min(elapsed / 5000, 1);

        // Draw animated background gradient
        const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            Math.max(canvas.width, canvas.height)
        );
        const hue = (elapsed / 20) % 360; // Rotating hue
        gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 30%, 10%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        this.localState!.particles.forEach((particle) => {
            const alpha = Math.sin(particle.life) * 0.5 + 0.5; // Pulsing alpha
            const size = particle.size * (Math.sin(particle.life * 1.5) * 0.3 + 1); // Pulsing size

            ctx.save();
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw animated title
        const titleY = centerY - 100;
        const titleScale = 1 + Math.sin(elapsed / 300) * 0.1; // Gentle breathing effect

        ctx.save();
        ctx.translate(centerX, titleY);
        ctx.scale(titleScale, titleScale);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        ctx.fillText('OFFICE HERO', 0, 0);
        ctx.restore();

        // Draw subtitle with typewriter effect
        const subtitle = 'A day in the life of a corporate warrior';
        const typewriterLength = Math.floor((elapsed / 100) % (subtitle.length + 10));
        const visibleText = subtitle.substring(0, typewriterLength);

        ctx.fillStyle = '#cccccc';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(visibleText, centerX, centerY);

        // Draw progress bar
        const barWidth = 300;
        const barHeight = 6;
        const barX = centerX - barWidth / 2;
        const barY = centerY + 100;

        // Background bar
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progress bar
        const progressGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        progressGradient.addColorStop(0, '#4ecdc4');
        progressGradient.addColorStop(1, '#45b7d1');
        ctx.fillStyle = progressGradient;
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);

        // Draw animated circles around progress bar
        for (let i = 0; i < 5; i++) {
            const angle = (elapsed / 500 + (i * Math.PI * 2) / 5) % (Math.PI * 2);
            const radius = 30;
            const circleX = centerX + Math.cos(angle) * radius;
            const circleY = barY + barHeight / 2 + Math.sin(angle) * 10;

            ctx.fillStyle = `hsl(${(hue + i * 72) % 360}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(circleX, circleY, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw skip instruction
        ctx.fillStyle = '#888888';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Enter to skip', centerX, canvas.height - 30);

        // Draw countdown
        const remainingTime = Math.ceil((5000 - elapsed) / 1000);
        if (remainingTime > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Auto-continue in ${remainingTime}s`, centerX, barY + 40);
        }

        // Restore canvas state after fade effect
        ctx.restore();
    }
}
