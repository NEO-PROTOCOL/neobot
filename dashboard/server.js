import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupAIRoutes } from './ai-routes.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased for image uploads
app.use(express.static(path.join(__dirname, '../dashboard')));

// Setup AI routes
setupAIRoutes(app);

// Storage (in-memory for now)
let reminders = [];
let messages = [];
let stats = {
    totalReminders: 0,
    totalMessages: 0
};

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        telegram: 'connected',
        scheduler: 'active',
        timestamp: new Date().toISOString()
    });
});

// Get Reminders
app.get('/api/reminders', async (req, res) => {
    try {
        // Get reminders from 'atq'
        const { stdout } = await execAsync('atq');
        const atJobs = stdout.trim().split('\n').filter(line => line).map(line => {
            const parts = line.split(/\s+/);
            return {
                id: parts[0],
                scheduledFor: new Date(parts.slice(2).join(' ')).toISOString(),
                text: 'Lembrete agendado'
            };
        });

        res.json(atJobs);
    } catch (error) {
        res.json(reminders);
    }
});

// Create Reminder
app.post('/api/reminders', async (req, res) => {
    try {
        const { text, when } = req.body;

        if (!text || !when) {
            return res.status(400).json({ error: 'Missing text or when' });
        }

        // Execute the remind script
        const scriptPath = path.join(__dirname, '../skills/reminders/remind.ts');
        const command = `pnpm tsx "${scriptPath}" "${text}" "${when}"`;

        const { stdout, stderr } = await execAsync(command, {
            cwd: path.join(__dirname, '..')
        });

        const reminder = {
            id: Date.now().toString(),
            text,
            when,
            createdAt: new Date().toISOString(),
            status: 'scheduled'
        };

        reminders.push(reminder);
        stats.totalReminders++;

        res.json({ success: true, reminder, output: stdout });
    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Messages
app.get('/api/messages', (req, res) => {
    res.json(messages.slice(-10).reverse());
});

// Send Message
app.post('/api/messages', async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: 'Missing to or message' });
        }

        // Execute the telegram script
        const scriptPath = path.join(__dirname, '../skills/telegram/scripts/telegram.ts');
        const command = `pnpm tsx "${scriptPath}" --to ${to} --message "${message}"`;

        const { stdout } = await execAsync(command, {
            cwd: path.join(__dirname, '..')
        });

        const msg = {
            id: Date.now().toString(),
            to,
            text: message,
            timestamp: new Date().toISOString(),
            from: 'Você',
            status: 'sent'
        };

        messages.push(msg);
        stats.totalMessages++;

        res.json({ success: true, message: msg, output: stdout });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Stats
app.get('/api/stats', (req, res) => {
    res.json(stats);
});

// Get System Status
app.get('/api/status', async (req, res) => {
    try {
        // Check if scheduler is running
        const { stdout: psOutput } = await execAsync('ps aux | grep "cron start" | grep -v grep');
        const schedulerRunning = psOutput.trim().length > 0;

        res.json({
            telegram: {
                status: 'connected',
                botToken: process.env.TELEGRAM_BOT_TOKEN ? 'configured' : 'missing'
            },
            scheduler: {
                status: schedulerRunning ? 'running' : 'stopped',
                activeJobs: reminders.length
            },
            stats
        });
    } catch (error) {
        res.json({
            telegram: { status: 'unknown' },
            scheduler: { status: 'unknown' },
            stats
        });
    }
});

// Serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🛰️  NΞØ BOT Dashboard API                           ║
║                                                       ║
║   Status: ✅ ONLINE                                   ║
║   Port: ${PORT}                                       ║
║   URL: http://localhost:${PORT}                       ║
║                                                       ║
║   Dashboard: http://localhost:${PORT}                 ║
║   API: http://localhost:${PORT}/api                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

export default app;
