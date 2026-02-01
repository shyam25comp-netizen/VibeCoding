
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Charts
    initCharts();

    // 2. Setup Navigation Logic
    setupNavigation();
});

function initCharts() {
    // Common Chart Defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

    // Performance Chart (Line)
    const ctxPerf = document.getElementById('performanceChart').getContext('2d');

    // Gradient fill
    const gradientFill = ctxPerf.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    new Chart(ctxPerf, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Predicted Sem 6'],
            datasets: [
                {
                    label: 'GPA Trend',
                    data: [7.8, 8.1, 8.4, 8.2, 8.7, 9.1],
                    borderColor: '#3b82f6',
                    backgroundColor: gradientFill,
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Class Average',
                    data: [7.5, 7.6, 7.5, 7.8, 7.9, 8.0],
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: 'white', usePointStyle: true, boxWidth: 8 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' },
                    min: 6,
                    max: 10
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });

    // Attendance Chart (Doughnut)
    const attendanceCanvas = document.getElementById('attendanceChart');
    if (attendanceCanvas) {
        const ctxAtt = attendanceCanvas.getContext('2d');
        new Chart(ctxAtt, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Medical'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        bodyColor: '#fff'
                    }
                }
            }
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Remove active class from all links
            navLinks.forEach(l => {
                l.classList.remove('active');
                const icon = l.querySelector('i');
                if (icon) icon.classList.remove('icon-active');
                // Lucide re-renders svgs, so we might need to toggle classes on the parent or handle SVGs differently if re-rendering matters.
                // Since this is static HTML with lucide.createIcons(), the <i> is replaced by <svg>.
                // We targeted classes on the <i>, but now it's an <svg>.
                // Let's rely on CSS mostly: .nav-link.active svg { color: var(--primary) }
            });

            // 2. Add active to clicked
            link.classList.add('active');

            // 3. Handle View Switching
            const pageId = link.getAttribute('data-page');

            // Hide all views
            views.forEach(view => view.style.display = 'none');

            // Show target view if exists, else show dashboard or placeholder
            const targetView = document.getElementById(`${pageId}-view`);
            if (targetView) {
                targetView.style.display = 'block';
            } else {
                // If we don't have a specific view, we could show a generic placeholder or just the dashboard for now
                if (pageId === 'dashboard') {
                    document.getElementById('dashboard-view').style.display = 'block';
                } else {
                    // Show a generic 'Coming Soon' for undefined views
                    // For this demo, let's reuse a generic placeholder logic or just alert
                    // Better: Create a generic placeholder dynamically or use one in HTML
                    alert(`Navigating to ${pageId} (Demo Placeholder)`);
                    document.getElementById('dashboard-view').style.display = 'block'; // Fallback
                }
            }
        });
    });
}

// Logic for AI Features

// ---------------------------
// 1. Marks Analyzer & Predictor
// ---------------------------
window.analyzeMarks = function() {
    const btn = document.querySelector('#marksForm button');
    const loading = document.getElementById('ai-analysis-loading');
    const result = document.getElementById('ai-analysis-result');
    const placeholder = document.getElementById('ai-analysis-placeholder');

    // UI Feedback
    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" size="18"></i> Processing...';
    lucide.createIcons();
    placeholder.style.display = 'none';
    loading.style.display = 'block';
    
    // Simulate AI Latency
    setTimeout(() => {
        loading.style.display = 'none';
        result.style.display = 'block';
        btn.innerHTML = '<i data-lucide="sparkles" size="18"></i> Re-Analyze';
        lucide.createIcons();
        
        // Simple logic mock
        const osMarks = document.getElementById('marks-os').value;
        const gpa = document.getElementById('predicted-gpa');
        const advice = document.getElementById('weak-area-text');

        if(osMarks < 70) {
            advice.innerHTML = `Your Operating Systems score (${osMarks}) is dragging down your average. Focus on <strong>Process Synchronization</strong> and <strong>Paging</strong> algorithms to boost your next GPA to 9.0+.`;
            gpa.innerText = "8.8";
            gpa.style.background = "linear-gradient(to right, #facc15, #fbbf24)";
            gpa.style.webkitBackgroundClip = "text";
        } else {
            advice.innerHTML = `Great job! Your robust scores suggest you're ready for Advanced System Design. Maintain this momentum to secure a <strong>9.5+ GPA</strong>.`;
             gpa.innerText = "9.5";
        }
    }, 1500);
}

// ---------------------------
// 2. Chatbot Logic
// ---------------------------
window.sendMessage = function() {
    const input = document.getElementById('chat-input');
    const history = document.getElementById('chat-history');
    const userText = input.value.trim();


    // Add User Message
    addMessage(userText, 'user');
    input.value = '';

    // Simulate AI Thinking
    setTimeout(() => {
        const aiResponse = generateAIResponse(userText);
        addMessage(aiResponse, 'ai');
    }, 1000);
}

function addMessage(text, sender) {
    const history = document.getElementById('chat-history');
    const isAi = sender === 'ai';
    
    // Avatar Color Logic
    const avatarIcon = isAi ? 'bot' : 'user';
    const avatarBg = isAi ? '' : 'style="background: linear-gradient(135deg, var(--accent), #f43f5e);"';

    const msgHTML = `
        <div class="message ${sender}-message">
             <div class="message-avatar" ${avatarBg}>
                <i data-lucide="${avatarIcon}" size="20" color="white"></i>
             </div>
             <div class="message-content">
                 <p>${text}</p>
             </div>
        </div>
    `;
    
    history.insertAdjacentHTML('beforeend', msgHTML);
    lucide.createIcons(); // Refresh icons for new elements
    history.scrollTop = history.scrollHeight;
}

function generateAIResponse(text) {
    const lower = text.toLowerCase();
    if(lower.includes('python') || lower.includes('data')) {
        return "Python is essential for Data Science! I recommend starting with 'Pandas' and 'NumPy' libraries. Would you like a 2-week learning roadmap?";
    }
    if(lower.includes('roadmap') || lower.includes('plan')) {
        return "Sure! Here is a plan:<br>1. Week 1: Python Basics & Statistics<br>2. Week 2: Data Visualization with Matplotlib<br>3. Week 3: Intro to ML Algorithms.<br><br>Shall I enroll you in a certification course for this?";
    }
    if(lower.includes('job') || lower.includes('salary')) {
    }
    return "That's interesting! Based on your academic history, combining this interest with your strong Math scores could lead to a role in Research. Tell me more about your specific goals.";
}

