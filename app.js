(() => {
  'use strict';

  const STORAGE_KEY = 'asif-os-workspace-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const todayISO = () => { const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()); const part = key => parts.find(item => item.type === key)?.value || '00'; return `${part('year')}-${part('month')}-${part('day')}`; };
  const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const shortDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No due date';
  const longDate = (value = new Date()) => value.toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' });
  const relativeTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Just now';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  function starterData() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      theme: 'dark',
      projects: [
        { id: 'p_auven', name: 'AUVEN Web Studio', type: 'Business', status: 'In progress', progress: 20, description: 'Build the studio, strengthen the portfolio and create a repeatable client workflow.', createdAt: new Date().toISOString() },
        { id: 'p_camp', name: 'CAMPiNCOX Website', type: 'Client website', status: 'In progress', progress: 45, description: 'Design, develop and prepare the website for handoff.', createdAt: new Date().toISOString() },
        { id: 'p_study', name: 'NU Honours — Accounting', type: 'Learning', status: 'Ongoing', progress: 10, description: 'Keep coursework, revision and exam preparation organised.', createdAt: new Date().toISOString() }
      ],
      tasks: [
        { id: 't_1', title: 'Review the CAMPiNCOX mobile layout', projectId: 'p_camp', status: 'todo', priority: 'High', due: '', createdAt: new Date().toISOString() },
        { id: 't_2', title: 'Write down AUVEN service packages', projectId: 'p_auven', status: 'todo', priority: 'Medium', due: '', createdAt: new Date().toISOString() },
        { id: 't_3', title: 'Plan the next Accounting study session', projectId: 'p_study', status: 'todo', priority: 'Medium', due: '', createdAt: new Date().toISOString() }
      ],
      subjects: [
        { id: 's_acc', name: 'Financial Accounting', code: 'HONOURS 1ST YEAR', progress: 10, target: 'Build a consistent revision routine', color: 'green' },
        { id: 's_mkt', name: 'Principles of Marketing', code: 'BUSINESS STUDIES', progress: 0, target: 'Understand concepts and practise exam answers', color: 'purple' }
      ],
      sessions: [],
      leads: [],
      notes: [
        { id: 'n_1', title: 'ASIF OS rule', body: 'Capture tasks quickly. Keep only a few priorities active. Review progress every week.\n\nReplace this starter note with your own working principles.', color: 'green', createdAt: new Date().toISOString() }
      ],
      prompts: [
        { id: 'pr_1', title: 'Learn a difficult topic', category: 'Study', description: 'A structured tutor prompt for understanding concepts, not memorising blindly.', body: 'Act as my subject tutor. Explain [TOPIC] in simple Bangla, keeping the important English terms in brackets. Start with prerequisites, then explain one idea at a time with an example. Ask me 3 questions to check understanding. Correct my mistakes directly and finish with an exam-ready summary.' },
        { id: 'pr_2', title: 'Debug a website issue', category: 'Development', description: 'Give the assistant enough context to diagnose before changing code.', body: 'Act as a senior web developer. I am a beginner. Diagnose this issue before proposing changes. Explain the likely cause, identify the exact file and code section, then give the smallest safe fix. Do not rewrite unrelated code. After the fix, explain how I can test it. Code / error: [PASTE HERE].' },
        { id: 'pr_3', title: 'Qualify a potential client', category: 'Business', description: 'Assess whether a lead is worth spending time on.', body: 'Act as a practical web-studio sales advisor. Evaluate this business as a potential website client: [BUSINESS + WEBSITE/SOCIAL LINKS]. Identify its likely customer, online presence gaps, one specific website opportunity, estimated project complexity, red flags, and a respectful first outreach message. Separate evidence from assumptions.' },
        { id: 'pr_4', title: 'Research before deciding', category: 'Research', description: 'A research brief that separates sources, evidence and assumptions.', body: 'Research [QUESTION] using current, credible sources. Prioritise primary sources. Give me the conclusion first, then evidence with links and dates. Separate confirmed facts from estimates and assumptions. Point out conflicting evidence, unknowns, and what would change the conclusion.' },
        { id: 'pr_5', title: 'Plan a focused workday', category: 'Productivity', description: 'Turn a long task list into a realistic plan.', body: 'Act as a strict planning coach. Here are my available hours: [HOURS]. Tasks: [TASKS]. Rank tasks by impact and urgency, estimate time conservatively, identify what should be postponed, and create a realistic schedule with breaks. Do not fit more work than the available time allows.' },
        { id: 'pr_6', title: 'Review an ad campaign', category: 'Marketing', description: 'Diagnose campaign performance before changing settings.', body: 'Act as a Meta Ads performance analyst. Analyse these campaign results: [SPEND, REACH, IMPRESSIONS, CPM, CTR, CPC, MESSAGES/LEADS, SALES]. Calculate relevant rates, identify the biggest bottleneck, separate what the data proves from possible explanations, and recommend one controlled next test. Do not recommend changes without evidence.' }
      ],
      weeklyReview: { wins: '', blockers: '', next: '' }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return starterData();
      const parsed = JSON.parse(raw);
      const base = starterData();
      return { ...base, ...parsed,
        projects: Array.isArray(parsed.projects) ? parsed.projects : base.projects,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : base.tasks,
        subjects: Array.isArray(parsed.subjects) ? parsed.subjects : base.subjects,
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        leads: Array.isArray(parsed.leads) ? parsed.leads : [],
        notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        prompts: Array.isArray(parsed.prompts) ? parsed.prompts : base.prompts,
        weeklyReview: parsed.weeklyReview || base.weeklyReview
      };
    } catch (error) {
      console.warn('ASIF OS could not read saved data:', error);
      return starterData();
    }
  }

  let state = loadState();
  let currentView = 'overview';
  let taskFilter = 'all';
  let taskSearch = '';
  let timerSeconds = 25 * 60;
  let timerRunning = false;
  let timerInterval = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      toast('Could not save. Browser storage may be full or disabled.', 'error');
      console.error(error);
      return false;
    }
  }

  function toast(message, type = '') {
    const root = $('#toastRoot');
    if (!root) return;
    const item = document.createElement('div');
    item.className = `toast ${type}`;
    item.textContent = message;
    root.appendChild(item);
    setTimeout(() => item.remove(), 3000);
  }

  function applyTheme() {
    document.body.classList.toggle('light', state.theme === 'light');
    const toggle = $('#themeToggle');
    if (toggle) toggle.textContent = state.theme === 'light' ? '☼' : '◐';
  }

  function projectName(id) {
    return state.projects.find(project => project.id === id)?.name || 'Unassigned';
  }
  function openTasks() { return state.tasks.filter(task => task.status !== 'done'); }
  function completedTasks() { return state.tasks.filter(task => task.status === 'done'); }
  function projectTaskCount(id) { return state.tasks.filter(task => task.projectId === id && task.status === 'done').length; }
  function taskStatusLabel(status) { return ({ todo: 'To do', doing: 'In progress', done: 'Completed' })[status] || 'To do'; }
  function priorityClass(priority) { return priority === 'High' ? 'tag-orange' : priority === 'Low' ? 'tag-purple' : ''; }
  function statusClass(status) { return status === 'done' ? 'tag-green' : status === 'doing' ? 'tag-purple' : ''; }

  const viewMeta = {
    overview: ['Overview', 'YOUR PERSONAL COMMAND CENTER'],
    focus: ['Focus & Tasks', 'MAKE PROGRESS VISIBLE'],
    projects: ['Projects', 'BUILD WITH DIRECTION'],
    study: ['Study Center', 'LEARN WITH CONSISTENCY'],
    clients: ['Client Pipeline', 'TURN CONVERSATIONS INTO WORK'],
    notes: ['Notes & Ideas', 'CAPTURE BEFORE YOU FORGET'],
    prompts: ['Prompt Lab', 'REUSABLE AI WORKFLOWS'],
    settings: ['Settings', 'YOUR DATA, YOUR CONTROL']
  };

  function render() {
    applyTheme();
    $$('.nav-item[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === currentView));
    $('#pageCrumb').textContent = viewMeta[currentView]?.[0] || 'Overview';
    $('#footerDate').textContent = longDate();
    const page = $('#pageContent');
    const renderers = { overview: renderOverview, focus: renderFocus, projects: renderProjects, study: renderStudy, clients: renderClients, notes: renderNotes, prompts: renderPrompts, settings: renderSettings };
    page.innerHTML = (renderers[currentView] || renderOverview)();
    if (currentView === 'overview') updateTimerDisplay();
  }

  function heading(title, description, action = '') {
    return `<div class="page-heading"><div><div class="eyebrow">${escapeHtml(viewMeta[currentView]?.[1] || '')}</div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${action}</div></div>`;
  }

  function renderOverview() {
    const activeProjects = state.projects.filter(project => !['Completed', 'Archived'].includes(project.status)).length;
    const leadsActive = state.leads.filter(lead => lead.stage !== 'Won' && lead.stage !== 'Lost').length;
    const studyMinutes = state.sessions.reduce((sum, session) => sum + Number(session.minutes || 0), 0);
    const dueTasks = openTasks().slice().sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')).slice(0, 4);
    const projectRows = state.projects.filter(project => !['Archived'].includes(project.status)).slice(0, 4);
    const hours = Math.floor(studyMinutes / 60);
    const mins = studyMinutes % 60;
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
    return `${heading('Your workspace, in focus.', 'One place to manage the work, learning and ideas that matter.', `<button class="secondary-button" data-action="open-review">Weekly review ↗</button>`)}
      <section class="welcome-panel panel"><div class="eyebrow">${greeting.toUpperCase()} · ${longDate()}</div><h2>Make the next move count.</h2><p>Choose fewer priorities. Finish what matters. Review your progress.</p><div class="welcome-meta"><span class="meta-pill"><b>${openTasks().length}</b> open tasks</span><span class="meta-pill"><b>${activeProjects}</b> active projects</span><span class="meta-pill"><b>${hours}h ${mins}m</b> study logged</span><span class="meta-pill">Starter data · customise it</span></div></section>
      <section class="grid stats-grid">
        <article class="stat-card"><div class="stat-top"><span>Open tasks</span><span class="stat-icon">◷</span></div><div class="stat-number">${openTasks().length.toString().padStart(2,'0')}</div><div class="stat-foot">${completedTasks().length} completed in total</div></article>
        <article class="stat-card"><div class="stat-top"><span>Active projects</span><span class="stat-icon">▤</span></div><div class="stat-number">${activeProjects.toString().padStart(2,'0')}</div><div class="stat-foot">Across your workspace</div></article>
        <article class="stat-card"><div class="stat-top"><span>Study time</span><span class="stat-icon">▧</span></div><div class="stat-number">${hours}<small style="font:500 13px 'DM Sans';color:var(--muted)">h</small> ${mins}<small style="font:500 13px 'DM Sans';color:var(--muted)">m</small></div><div class="stat-foot">${state.sessions.length} study sessions logged</div></article>
        <article class="stat-card"><div class="stat-top"><span>Live leads</span><span class="stat-icon">◉</span></div><div class="stat-number">${leadsActive.toString().padStart(2,'0')}</div><div class="stat-foot">${state.leads.filter(lead => lead.stage === 'Won').length} won opportunities</div></article>
      </section>
      <section class="grid overview-grid">
        <div>
          <div class="panel" style="margin-bottom:15px"><div class="section-title"><div><h2>Priority queue</h2><p>Your next actions, not a giant to-do list</p></div><button class="subtle-link" data-view="focus">View all →</button></div>
            ${dueTasks.length ? `<div class="task-list">${dueTasks.map(task => `<div class="task-row ${task.status === 'done' ? 'done' : ''}"><button class="task-check ${task.status === 'done' ? 'checked' : ''}" data-action="toggle-task" data-id="${task.id}" aria-label="Complete task">✓</button><div class="task-main"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(projectName(task.projectId))}</small></div><span class="task-tag ${priorityClass(task.priority)}">${escapeHtml(task.priority || 'Medium')}</span><span class="task-due">${shortDate(task.due)}</span></div>`).join('')}</div>` : `<div class="empty-state"><strong>Nothing in the queue.</strong>Add a task when something needs your attention.</div>`}
          </div>
          <div class="panel"><div class="section-title"><div><h2>Projects in motion</h2><p>Keep the important work visible</p></div><button class="subtle-link" data-view="projects">All projects →</button></div>
            ${projectRows.length ? `<div class="project-mini-list">${projectRows.map(project => `<div class="project-mini"><div><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.status)} · ${escapeHtml(project.type || 'Project')}</small></div><span class="progress-value">${Number(project.progress)||0}%</span><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,Number(project.progress)||0))}%"></div></div></div>`).join('')}</div>` : `<div class="empty-state"><strong>No projects yet.</strong>Create a project to organise related tasks.</div>`}
          </div>
        </div>
        <div class="right-stack">
          <div class="panel"><div class="section-title"><div><h2>Quick capture</h2><p>Get it out of your head</p></div></div><div class="quick-grid"><button class="quick-tile" data-action="add-task"><span>＋</span><strong>New task</strong></button><button class="quick-tile" data-action="add-note"><span>▱</span><strong>Write a note</strong></button><button class="quick-tile" data-action="add-project"><span>▤</span><strong>New project</strong></button><button class="quick-tile" data-action="add-lead"><span>◉</span><strong>Add a lead</strong></button></div></div>
          <div class="panel"><div class="section-title"><div><h2>Focus timer</h2><p>One uninterrupted work block</p></div><span class="status-tag tag-green">25 MIN</span></div><div class="focus-timer"><div><div id="timerDisplay" class="timer-display">25:00</div><div class="timer-caption" id="timerCaption">Ready when you are</div></div><div class="timer-controls"><button data-action="timer-toggle" id="timerToggle">Start</button><button data-action="timer-reset">Reset</button></div></div></div>
          <div class="panel"><div class="section-title"><div><h2>Small rule</h2><p>A system only works when you use it</p></div><span style="color:var(--accent)">✳</span></div><p style="font-size:11px;line-height:1.65;color:var(--subtle);margin:0">Before adding more tools, decide what your next important outcome is. Then give it a task, a time block and a clear finish line.</p></div>
        </div>
      </section>`;
  }

  function renderFocus() {
    const filters = ['all','todo','doing','done'];
    let tasks = state.tasks.filter(task => taskFilter === 'all' || task.status === taskFilter);
    if (taskSearch) tasks = tasks.filter(task => `${task.title} ${projectName(task.projectId)}`.toLowerCase().includes(taskSearch.toLowerCase()));
    tasks.sort((a,b) => (a.status === 'done') - (b.status === 'done') || ({High:0,Medium:1,Low:2}[a.priority] ?? 1) - ({High:0,Medium:1,Low:2}[b.priority] ?? 1));
    return `${heading('Focus on the next action.', 'Break projects into clear, finishable tasks.', `<button class="primary-button" data-action="add-task">＋ Add task</button>`)}
      <div class="client-stats"><div class="client-stat"><span>All tasks</span><strong>${state.tasks.length}</strong></div><div class="client-stat"><span>In progress</span><strong>${state.tasks.filter(t=>t.status==='doing').length}</strong></div><div class="client-stat"><span>Completed</span><strong>${completedTasks().length}</strong></div></div>
      <div class="panel"><div class="filter-row">${filters.map(filter => `<button class="filter-button ${taskFilter===filter?'active':''}" data-action="task-filter" data-filter="${filter}">${filter==='all'?'All tasks':filter==='todo'?'To do':filter==='doing'?'In progress':'Completed'} ${filter==='all'?`(${state.tasks.length})`:''}</button>`).join('')}<span style="flex:1"></span><input class="inline-search" id="taskSearch" placeholder="Search tasks..." value="${escapeHtml(taskSearch)}"></div>
      <div class="tasks-page-list">${tasks.length ? tasks.map(task => `<div class="task-row task-page-row ${task.status==='done'?'done':''}"><button class="task-check ${task.status==='done'?'checked':''}" data-action="toggle-task" data-id="${task.id}" aria-label="Toggle completion">✓</button><div class="task-main"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(projectName(task.projectId))} · ${task.due?`Due ${shortDate(task.due)}`:'No due date'}</small></div><span class="task-tag ${priorityClass(task.priority)}">${escapeHtml(task.priority||'Medium')}</span><span class="task-tag ${statusClass(task.status)}">${taskStatusLabel(task.status)}</span><div class="task-actions"><button class="mini-action" data-action="edit-task" data-id="${task.id}" title="Edit">✎</button><button class="mini-action" data-action="delete-task" data-id="${task.id}" title="Delete">×</button></div></div>`).join('') : `<div class="empty-state"><strong>No tasks found.</strong>${taskSearch?'Try another search.':'Add a task and give it a clear finish line.'}</div>`}</div></div>`;
  }

  function renderProjects() {
    return `${heading('Build with direction.', 'Group related tasks and track the outcomes you are moving towards.', `<button class="primary-button" data-action="add-project">＋ New project</button>`)}
      <div class="grid projects-grid">${state.projects.length ? state.projects.map(project => `<article class="project-card"><div class="project-card-top"><div class="project-symbol">▤</div><span class="task-tag ${project.status==='Completed'?'tag-green':project.status==='On hold'?'tag-orange':''}">${escapeHtml(project.status)}</span></div><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.description || 'No description added yet.')}</p><div class="subject-meta"><span>${escapeHtml(project.type || 'Project')}</span><span>${Number(project.progress)||0}% complete</span></div><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,Number(project.progress)||0))}%"></div></div><div class="project-card-bottom"><small>${state.tasks.filter(t=>t.projectId===project.id).length} tasks · ${projectTaskCount(project.id)} done</small><div class="project-card-actions"><button class="mini-action" data-action="edit-project" data-id="${project.id}" title="Edit project">✎</button><button class="mini-action" data-action="delete-project" data-id="${project.id}" title="Delete project">×</button></div></div></article>`).join('') : `<div class="empty-state" style="grid-column:1/-1"><strong>No projects created.</strong>Start with one outcome you want to complete.</div>`}</div>`;
  }

  function renderStudy() {
    const totalMinutes = state.sessions.reduce((sum,s)=>sum+Number(s.minutes||0),0);
    const sessions = state.sessions.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8);
    return `${heading('Learn with consistency.', 'Track subjects and study sessions. Progress is yours to update.', `<button class="primary-button" data-action="add-session">＋ Log study session</button>`)}
      <div class="client-stats"><div class="client-stat"><span>Total study time</span><strong>${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m</strong></div><div class="client-stat"><span>Sessions logged</span><strong>${state.sessions.length}</strong></div><div class="client-stat"><span>Subjects</span><strong>${state.subjects.length}</strong></div></div>
      <div class="section-title"><div><h2>Your subjects</h2><p>Update mastery progress as you complete topics</p></div><button class="subtle-link" data-action="add-subject">＋ Add subject</button></div>
      <div class="grid subject-grid">${state.subjects.length ? state.subjects.map(subject=>`<article class="subject-card"><div class="subject-head"><div class="subject-icon">▧</div><span class="task-tag ${subject.color==='purple'?'tag-purple':'tag-green'}">${escapeHtml(subject.code||'SUBJECT')}</span></div><h3>${escapeHtml(subject.name)}</h3><p>${escapeHtml(subject.target||'Add a learning goal for this subject.')}</p><div class="subject-meta"><span>Mastery progress</span><strong>${Math.max(0,Math.min(100,Number(subject.progress)||0))}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,Number(subject.progress)||0))}%"></div></div><div class="project-card-bottom"><small>${state.sessions.filter(s=>s.subjectId===subject.id).reduce((sum,s)=>sum+Number(s.minutes||0),0)} min logged</small><div class="project-card-actions"><button class="mini-action" data-action="progress-down" data-id="${subject.id}" title="Decrease progress">−</button><button class="mini-action" data-action="progress-up" data-id="${subject.id}" title="Increase progress">＋</button><button class="mini-action" data-action="edit-subject" data-id="${subject.id}" title="Edit subject">✎</button><button class="mini-action" data-action="delete-subject" data-id="${subject.id}" title="Delete subject">×</button></div></div></article>`).join('') : `<div class="empty-state" style="grid-column:1/-1"><strong>No subjects yet.</strong>Add a subject to start tracking your learning.</div>`}</div>
      <div class="grid study-lower"><div class="panel"><div class="section-title"><div><h2>Recent study sessions</h2><p>Your logged learning time</p></div></div>${sessions.length?`<div class="session-list">${sessions.map(session=>`<div class="session-row"><div><strong>${escapeHtml(session.topic||'Study session')}</strong><small>${escapeHtml(state.subjects.find(s=>s.id===session.subjectId)?.name||'Subject removed')} · ${relativeTime(session.date)}</small></div><span class="session-duration">${Number(session.minutes)} min</span></div>`).join('')}</div>`:`<div class="empty-state"><strong>No sessions logged.</strong>Log your first focused study block.</div>`}</div>
      <div class="panel"><div class="section-title"><div><h2>A useful study loop</h2><p>Don't confuse time spent with learning gained</p></div></div><div class="project-mini-list"><div class="project-mini"><div><strong>1. Understand</strong><small>Learn the concept before memorising it.</small></div><span class="progress-value">01</span></div><div class="project-mini"><div><strong>2. Retrieve</strong><small>Close the book and explain it from memory.</small></div><span class="progress-value">02</span></div><div class="project-mini"><div><strong>3. Practise</strong><small>Answer questions under exam conditions.</small></div><span class="progress-value">03</span></div><div class="project-mini"><div><strong>4. Review</strong><small>Revisit weak areas after a gap.</small></div><span class="progress-value">04</span></div></div></div></div>`;
  }

  function renderClients() {
    const stages = ['Prospect','Contacted','Negotiating','Won','Lost'];
    const active = state.leads.filter(lead=>!['Won','Lost'].includes(lead.stage)).length;
    const won = state.leads.filter(lead=>lead.stage==='Won').length;
    return `${heading('Build a real pipeline.', 'Track potential clients and the next action for each conversation.', `<button class="primary-button" data-action="add-lead">＋ Add lead</button>`)}
      <div class="client-stats"><div class="client-stat"><span>Total leads</span><strong>${state.leads.length}</strong></div><div class="client-stat"><span>Active conversations</span><strong>${active}</strong></div><div class="client-stat"><span>Won</span><strong>${won}</strong></div></div>
      <div class="grid leads-grid">${stages.map(stage=>{const list=state.leads.filter(lead=>lead.stage===stage);return `<section class="lead-column"><div class="lead-column-head"><span>${stage.toUpperCase()}</span><span>${list.length.toString().padStart(2,'0')}</span></div><div class="lead-stack">${list.length?list.map(lead=>`<article class="lead-card"><strong>${escapeHtml(lead.name)}</strong><p>${escapeHtml(lead.business||'Business not specified')}${lead.value?` · ${escapeHtml(lead.value)}`:''}<br>${escapeHtml(lead.nextAction||'No next action added')}</p><div class="lead-foot"><small>${escapeHtml(lead.contact||'No contact')}</small>${['Won','Lost'].includes(stage)?'':`<button class="lead-move" data-action="move-lead" data-id="${lead.id}">Move →</button>`}<button class="mini-action" data-action="edit-lead" data-id="${lead.id}" title="Edit lead">✎</button><button class="mini-action" data-action="delete-lead" data-id="${lead.id}" title="Delete lead">×</button></div></article>`).join(''):`<div class="empty-state">No leads here.</div>`}</div></section>`}).join('')}</div>
      <p class="muted" style="font-size:10px;margin:15px 2px 0">Keep this pipeline factual. A business is not a qualified lead until you have a clear contact path and a plausible need.</p>`;
  }

  function renderNotes() {
    return `${heading('Capture your thinking.', 'Save ideas, decisions, snippets and things you do not want to forget.', `<button class="primary-button" data-action="add-note">＋ New note</button>`)}
      <div class="grid notes-grid">${state.notes.length?state.notes.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(note=>`<article class="note-card" style="--note-color:${note.color==='purple'?'var(--purple)':note.color==='orange'?'var(--orange)':'var(--accent)'}"><button class="note-delete" data-action="delete-note" data-id="${note.id}" aria-label="Delete note">×</button><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.body)}</p><small>${relativeTime(note.createdAt)}</small><button class="subtle-link" data-action="edit-note" data-id="${note.id}" style="float:right">Edit ↗</button></article>`).join(''):`<div class="empty-state" style="grid-column:1/-1"><strong>Your notes start here.</strong>Capture an idea, a decision or a useful reference.</div>`}</div>`;
  }

  function renderPrompts() {
    return `${heading('A reusable prompt library.', 'Keep your best instructions. Replace the placeholders before using a prompt.', `<button class="primary-button" data-action="add-prompt">＋ Save prompt</button>`)}
      <div class="grid prompts-grid">${state.prompts.map(prompt=>`<article class="prompt-card"><div class="prompt-card-top"><span class="prompt-category">${escapeHtml(prompt.category||'GENERAL')}</span><button class="mini-action" data-action="delete-prompt" data-id="${prompt.id}" title="Delete prompt">×</button></div><h3>${escapeHtml(prompt.title)}</h3><p>${escapeHtml(prompt.description||prompt.body.slice(0,140))}</p><button data-action="copy-prompt" data-id="${prompt.id}">Copy prompt ↗</button></article>`).join('')}</div>`;
  }

  function renderSettings() {
    const bytes = new Blob([JSON.stringify(state)]).size;
    return `${heading('Keep control of your workspace.', 'Your records are stored in this browser. Export a backup before clearing browser data.', '')}
      <div class="grid settings-grid"><section class="panel settings-card"><h3>Data & backups</h3><p>Export all projects, tasks, subjects, sessions, leads, notes and prompts as a JSON file. Import a backup to restore it on this browser.</p><div class="settings-actions"><button class="primary-button" data-action="export-data">↓ Export backup</button><button class="secondary-button" data-action="import-data">↑ Import backup</button><input type="file" id="importFile" accept="application/json,.json" hidden></div><div class="divider"></div><div style="display:flex;justify-content:space-between;color:var(--muted);font-size:10px"><span>Approx. data size</span><strong style="color:var(--text)">${(bytes/1024).toFixed(1)} KB</strong></div><div style="display:flex;justify-content:space-between;color:var(--muted);font-size:10px;margin-top:8px"><span>Storage mode</span><strong style="color:var(--green)">Local browser storage</strong></div></section>
      <section class="panel settings-card"><h3>Appearance</h3><p>Choose the workspace appearance. This setting is saved with your local data.</p><div class="settings-actions"><button class="${state.theme==='dark'?'primary-button':'secondary-button'}" data-action="set-theme" data-theme="dark">Dark mode</button><button class="${state.theme==='light'?'primary-button':'secondary-button'}" data-action="set-theme" data-theme="light">Light mode</button></div><div class="divider"></div><h3>Privacy & limits</h3><p>ASIF OS does not send your records to a server. Anyone using this browser profile may be able to access the data. This first version has no account sync or multi-device backup.</p></section>
      <section class="panel settings-card"><h3>Starter workspace</h3><p>The initial projects, tasks, subjects, note and prompts are editable starter records. Keep what is useful and remove the rest.</p><div class="settings-actions"><button class="secondary-button" data-action="restore-starter">Restore starter data</button></div></section>
      <section class="panel settings-card"><h3>Reset workspace</h3><p>Delete all locally saved workspace data and return to an empty workspace. Export a backup first if you may need it later.</p><div class="settings-actions"><button class="danger-button" data-action="reset-data">Reset all data</button></div></section></div>`;
  }

  function openModal(title, subtitle, content) {
    $('#modalRoot').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><div><h2 id="modalTitle">${title}</h2><p>${subtitle}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div>${content}</section></div>`;
    const first = $('input,textarea,select,button', $('.modal'));
    if (first) first.focus();
  }

  function closeModal() { $('#modalRoot').innerHTML = ''; }
  function inputField(label, name, value = '', type = 'text', placeholder = '', extra = '') {
    return `<div class="field"><label for="f_${name}">${label}</label><input id="f_${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${extra}></div>`;
  }
  function selectField(label, name, options, selected = '') {
    return `<div class="field"><label for="f_${name}">${label}</label><select id="f_${name}" name="${name}">${options.map(option=>`<option value="${escapeHtml(option.value)}" ${option.value===selected?'selected':''}>${escapeHtml(option.label)}</option>`).join('')}</select></div>`;
  }
  function textareaField(label, name, value = '', placeholder = '', full = true) {
    return `<div class="field ${full?'full':''}"><label for="f_${name}">${label}</label><textarea id="f_${name}" name="${name}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea></div>`;
  }
  function formWrap(type, fields, submitText = 'Save') {
    return `<form id="entityForm" data-form="${type}"><div class="form-grid">${fields}</div><div class="form-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">${submitText}</button></div></form>`;
  }

  function showTaskForm(task = null) {
    const projectOptions = [{value:'',label:'Unassigned'}, ...state.projects.map(p=>({value:p.id,label:p.name}))];
    openModal(task?'Edit task':'Add a task', 'Make the task specific and finishable.', formWrap('task',
      `<div class="field full"><label for="f_title">Task title</label><input id="f_title" name="title" required maxlength="120" value="${escapeHtml(task?.title||'')}" placeholder="What needs to get done?"></div>${selectField('Project','projectId',projectOptions,task?.projectId||'')}${selectField('Priority','priority',['High','Medium','Low'].map(v=>({value:v,label:v})),task?.priority||'Medium')}${selectField('Status','status',[{value:'todo',label:'To do'},{value:'doing',label:'In progress'},{value:'done',label:'Completed'}],task?.status||'todo')}${inputField('Due date','due',task?.due||'','date')}`, 'Save task'));
    $('#entityForm').dataset.editId = task?.id || '';
  }

  function showProjectForm(project = null) {
    openModal(project?'Edit project':'Create a project','Define the outcome and track progress.',formWrap('project',
      `<div class="field full"><label for="f_name">Project name</label><input id="f_name" name="name" required maxlength="80" value="${escapeHtml(project?.name||'')}" placeholder="Project name"></div>${inputField('Type','type',project?.type||'Personal','text','Business, study, website...')}${selectField('Status','status',['In progress','Ongoing','On hold','Completed','Archived'].map(v=>({value:v,label:v})),project?.status||'In progress')}${inputField('Progress %','progress',project?.progress??0,'number','','min="0" max="100"')}${textareaField('Description','description',project?.description||'','What does done look like?')}`, 'Save project'));
    $('#entityForm').dataset.editId = project?.id || '';
  }

  function showSubjectForm(subject = null) {
    openModal(subject?'Edit subject':'Add a subject','Keep the goal measurable. Update mastery progress as you learn.',formWrap('subject',
      `<div class="field full"><label for="f_name">Subject name</label><input id="f_name" name="name" required maxlength="80" value="${escapeHtml(subject?.name||'')}" placeholder="Subject name"></div>${inputField('Course / label','code',subject?.code||'','text','Honours 1st Year')}${inputField('Mastery progress %','progress',subject?.progress??0,'number','','min="0" max="100"')}${textareaField('Learning target','target',subject?.target||'','What do you want to master?')}`, 'Save subject'));
    $('#entityForm').dataset.editId = subject?.id || '';
  }

  function showSessionForm() {
    const subjects = state.subjects.map(s=>({value:s.id,label:s.name}));
    openModal('Log a study session','Record focused study time and what you covered.',formWrap('session',
      `${selectField('Subject','subjectId',subjects,state.subjects[0]?.id||'')}${inputField('Duration (minutes)','minutes',45,'number','','min="1" max="1440"')}<div class="field full"><label for="f_topic">What did you study?</label><input id="f_topic" name="topic" required maxlength="120" placeholder="Topic, chapter or practice set"></div>`, 'Log session'));
  }

  function showLeadForm(lead = null) {
    openModal(lead?'Edit lead':'Add a potential client','Record the next action. A lead is not a client until work is agreed.',formWrap('lead',
      `<div class="field full"><label for="f_name">Contact / business name</label><input id="f_name" name="name" required maxlength="100" value="${escapeHtml(lead?.name||'')}" placeholder="Name or business"></div>${inputField('Business type','business',lead?.business||'','text','e.g. Restaurant, retailer')}${inputField('Contact method','contact',lead?.contact||'','text','Email, phone or page URL')}${selectField('Pipeline stage','stage',['Prospect','Contacted','Negotiating','Won','Lost'].map(v=>({value:v,label:v})),lead?.stage||'Prospect')}${inputField('Potential value','value',lead?.value||'','text','Optional estimate')}${textareaField('Next action','nextAction',lead?.nextAction||'','What is the next concrete step?')}`, 'Save lead'));
    $('#entityForm').dataset.editId = lead?.id || '';
  }

  function showNoteForm(note = null) {
    openModal(note?'Edit note':'Capture a note','Keep the useful part. You can search these notes later.',formWrap('note',
      `<div class="field full"><label for="f_title">Title</label><input id="f_title" name="title" required maxlength="80" value="${escapeHtml(note?.title||'')}" placeholder="A clear title"></div>${textareaField('Note','body',note?.body||'','Write the thought down...')}${selectField('Accent','color',[{value:'green',label:'Green'},{value:'purple',label:'Purple'},{value:'orange',label:'Orange'}],note?.color||'green')}`, 'Save note'));
    $('#entityForm').dataset.editId = note?.id || '';
  }

  function showPromptForm() {
    openModal('Save a prompt','Save instructions you expect to reuse.',formWrap('prompt',
      `<div class="field full"><label for="f_title">Prompt name</label><input id="f_title" name="title" required maxlength="80" placeholder="Prompt title"></div>${inputField('Category','category','General','text','Study, development, business...')}${textareaField('Description','description','','What is this prompt useful for?')}${textareaField('Full prompt','body','','Paste the full prompt here.')}`, 'Save prompt'));
  }

  function showQuickAdd() {
    openModal('Quick add','Choose what you want to capture.',`<div class="quick-grid"><button class="quick-tile" data-action="add-task"><span>＋</span><strong>New task</strong></button><button class="quick-tile" data-action="add-project"><span>▤</span><strong>New project</strong></button><button class="quick-tile" data-action="add-note"><span>▱</span><strong>New note</strong></button><button class="quick-tile" data-action="add-lead"><span>◉</span><strong>New lead</strong></button><button class="quick-tile" data-action="add-session"><span>▧</span><strong>Study session</strong></button><button class="quick-tile" data-action="add-subject"><span>✳</span><strong>Study subject</strong></button></div>`);
  }

  function handleFormSubmit(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    const editId = form.dataset.editId;
    const now = new Date().toISOString();
    switch (form.dataset.form) {
      case 'task': {
        const record = { id: editId || uid('task'), title: data.title.trim(), projectId: data.projectId, priority: data.priority, status: data.status, due: data.due, createdAt: editId ? state.tasks.find(t=>t.id===editId)?.createdAt || now : now };
        state.tasks = editId ? state.tasks.map(t=>t.id===editId?record:t) : [record,...state.tasks];
        break;
      }
      case 'project': {
        const record = { id: editId || uid('project'), name: data.name.trim(), type: data.type.trim(), status: data.status, progress: Math.max(0,Math.min(100,Number(data.progress)||0)), description: data.description.trim(), createdAt: editId ? state.projects.find(p=>p.id===editId)?.createdAt || now : now };
        state.projects = editId ? state.projects.map(p=>p.id===editId?record:p) : [record,...state.projects];
        break;
      }
      case 'subject': {
        const record = { id: editId || uid('subject'), name: data.name.trim(), code: data.code.trim(), progress: Math.max(0,Math.min(100,Number(data.progress)||0)), target: data.target.trim(), color: editId ? state.subjects.find(s=>s.id===editId)?.color || 'green' : 'green' };
        state.subjects = editId ? state.subjects.map(s=>s.id===editId?record:s) : [record,...state.subjects];
        break;
      }
      case 'session':
        state.sessions.unshift({ id: uid('session'), subjectId: data.subjectId, minutes: Math.max(1,Math.min(1440,Number(data.minutes)||1)), topic: data.topic.trim(), date: now });
        break;
      case 'lead': {
        const record = { id: editId || uid('lead'), name: data.name.trim(), business: data.business.trim(), contact: data.contact.trim(), stage: data.stage, value: data.value.trim(), nextAction: data.nextAction.trim(), createdAt: editId ? state.leads.find(l=>l.id===editId)?.createdAt || now : now };
        state.leads = editId ? state.leads.map(l=>l.id===editId?record:l) : [record,...state.leads];
        break;
      }
      case 'note': {
        const record = { id: editId || uid('note'), title: data.title.trim(), body: data.body.trim(), color: data.color, createdAt: editId ? state.notes.find(n=>n.id===editId)?.createdAt || now : now };
        state.notes = editId ? state.notes.map(n=>n.id===editId?record:n) : [record,...state.notes];
        break;
      }
      case 'prompt':
        state.prompts.unshift({ id: uid('prompt'), title: data.title.trim(), category: data.category.trim() || 'General', description: data.description.trim(), body: data.body.trim() });
        break;
      default: return;
    }
    saveState(); closeModal(); render(); toast(editId ? 'Changes saved.' : 'Added to your workspace.');
  }

  function updateTask(id, updater) {
    state.tasks = state.tasks.map(task => task.id === id ? updater(task) : task);
    saveState(); render();
  }
  function removeRecord(collection, id) {
    state[collection] = state[collection].filter(item=>item.id!==id);
    saveState(); render(); toast('Item deleted.');
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const temporary = document.createElement('textarea'); temporary.value = value; temporary.style.position='fixed'; temporary.style.opacity='0'; document.body.appendChild(temporary); temporary.select();
        const ok = document.execCommand('copy'); temporary.remove(); if (!ok) throw new Error('Clipboard unavailable');
      }
      toast('Copied to clipboard.');
    } catch (error) { toast('Could not copy. Open the prompt and copy it manually.', 'error'); }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `asif-os-backup-${todayISO()}.json`; anchor.click(); URL.revokeObjectURL(url);
    toast('Backup exported.');
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        const required = ['projects','tasks','subjects','sessions','leads','notes','prompts'];
        if (!imported || !required.every(key=>Array.isArray(imported[key]))) throw new Error('Invalid backup structure');
        state = { ...starterData(), ...imported, theme: imported.theme === 'light' ? 'light' : 'dark' };
        saveState(); currentView='overview'; render(); toast('Backup imported successfully.');
      } catch (error) { toast('That file is not a valid ASIF OS backup.', 'error'); }
    };
    reader.onerror = () => toast('Could not read that file.', 'error');
    reader.readAsText(file);
  }

  function updateTimerDisplay() {
    const display = $('#timerDisplay');
    if (display) display.textContent = `${String(Math.floor(timerSeconds/60)).padStart(2,'0')}:${String(timerSeconds%60).padStart(2,'0')}`;
    const caption = $('#timerCaption');
    if (caption) caption.textContent = timerRunning ? 'Stay with one task.' : timerSeconds === 25*60 ? 'Ready when you are' : timerSeconds === 0 ? 'Focus block complete.' : 'Paused';
    const toggle = $('#timerToggle'); if (toggle) toggle.textContent = timerRunning ? 'Pause' : timerSeconds === 0 ? 'Start again' : 'Start';
  }
  function toggleTimer() {
    if (timerRunning) { clearInterval(timerInterval); timerRunning=false; updateTimerDisplay(); return; }
    if (timerSeconds===0) timerSeconds=25*60;
    timerRunning=true; updateTimerDisplay();
    timerInterval=setInterval(()=>{ timerSeconds=Math.max(0,timerSeconds-1); updateTimerDisplay(); if(timerSeconds===0){clearInterval(timerInterval);timerRunning=false;toast('Focus block complete. Take a short break.');updateTimerDisplay();}},1000);
  }
  function resetTimer() { clearInterval(timerInterval); timerRunning=false; timerSeconds=25*60; updateTimerDisplay(); }

  function showReview() {
    const review=state.weeklyReview||{};
    openModal('Weekly review','Be honest. The goal is to improve your next week, not to write a report.',`<form id="reviewForm"><div class="form-grid">${textareaField('What went well?','wins',review.wins||'','Progress, decisions and things completed.')}${textareaField('What blocked you?','blockers',review.blockers||'','Distractions, unclear tasks or missing skills.')}${textareaField('What are the 3 priorities for next week?','next',review.next||'','Keep the list short.',true)}</div><div class="form-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="submit" class="primary-button">Save review</button></div></form>`);
  }

  function searchWorkspace(query) {
    const q=query.trim().toLowerCase();
    if(!q) return [];
    const results=[];
    state.tasks.forEach(item=>{if(item.title.toLowerCase().includes(q))results.push({type:'Task',name:item.title,view:'focus'});});
    state.projects.forEach(item=>{if(item.name.toLowerCase().includes(q))results.push({type:'Project',name:item.name,view:'projects'});});
    state.subjects.forEach(item=>{if(item.name.toLowerCase().includes(q))results.push({type:'Subject',name:item.name,view:'study'});});
    state.leads.forEach(item=>{if(`${item.name} ${item.business}`.toLowerCase().includes(q))results.push({type:'Lead',name:item.name,view:'clients'});});
    state.notes.forEach(item=>{if(`${item.title} ${item.body}`.toLowerCase().includes(q))results.push({type:'Note',name:item.title,view:'notes'});});
    state.prompts.forEach(item=>{if(`${item.title} ${item.description}`.toLowerCase().includes(q))results.push({type:'Prompt',name:item.title,view:'prompts'});});
    return results.slice(0,8);
  }

  function handleClick(event) {
    const viewButton=event.target.closest('[data-view]');
    if(viewButton){currentView=viewButton.dataset.view;$('#sidebar').classList.remove('open');render();return;}
    const button=event.target.closest('[data-action]');
    if(!button) return;
    const {action,id}=button.dataset;
    switch(action){
      case 'add-task': closeModal();showTaskForm();break;
      case 'edit-task': showTaskForm(state.tasks.find(t=>t.id===id));break;
      case 'toggle-task': updateTask(id,task=>({...task,status:task.status==='done'?'todo':'done'}));break;
      case 'delete-task': if(confirm('Delete this task?'))removeRecord('tasks',id);break;
      case 'task-filter': taskFilter=button.dataset.filter;render();break;
      case 'add-project': closeModal();showProjectForm();break;
      case 'edit-project': showProjectForm(state.projects.find(p=>p.id===id));break;
      case 'delete-project': if(confirm('Delete this project? Related tasks will become unassigned.')){state.tasks=state.tasks.map(t=>t.projectId===id?{...t,projectId:''}:t);removeRecord('projects',id);}break;
      case 'add-subject': closeModal();showSubjectForm();break;
      case 'edit-subject': showSubjectForm(state.subjects.find(s=>s.id===id));break;
      case 'delete-subject': if(confirm('Delete this subject? Existing study-session history will be kept.'))removeRecord('subjects',id);break;
      case 'progress-up': state.subjects=state.subjects.map(s=>s.id===id?{...s,progress:Math.min(100,(Number(s.progress)||0)+5)}:s);saveState();render();break;
      case 'progress-down': state.subjects=state.subjects.map(s=>s.id===id?{...s,progress:Math.max(0,(Number(s.progress)||0)-5)}:s);saveState();render();break;
      case 'add-session': closeModal(); if(!state.subjects.length){toast('Add a subject first.','error');showSubjectForm();}else showSessionForm();break;
      case 'add-lead': closeModal();showLeadForm();break;
      case 'edit-lead': showLeadForm(state.leads.find(l=>l.id===id));break;
      case 'move-lead': {const lead=state.leads.find(l=>l.id===id);const stages=['Prospect','Contacted','Negotiating','Won'];const index=stages.indexOf(lead.stage);lead.stage=stages[Math.min(index+1,stages.length-1)];saveState();render();toast(`Lead moved to ${lead.stage}.`);break;}
      case 'delete-lead': if(confirm('Delete this lead?'))removeRecord('leads',id);break;
      case 'add-note': closeModal();showNoteForm();break;
      case 'edit-note': showNoteForm(state.notes.find(n=>n.id===id));break;
      case 'delete-note': if(confirm('Delete this note?'))removeRecord('notes',id);break;
      case 'add-prompt': showPromptForm();break;
      case 'delete-prompt': if(confirm('Delete this prompt?'))removeRecord('prompts',id);break;
      case 'copy-prompt': {const prompt=state.prompts.find(p=>p.id===id);if(prompt)copyText(prompt.body);break;}
      case 'quick-add': showQuickAdd();break;
      case 'close-modal': if(button.classList.contains('modal-backdrop') && event.target!==button) return;closeModal();break;
      case 'open-settings': currentView='settings';closeModal();render();break;
      case 'open-review': showReview();break;
      case 'timer-toggle': toggleTimer();break;
      case 'timer-reset': resetTimer();break;
      case 'export-data': exportData();break;
      case 'import-data': $('#importFile')?.click();break;
      case 'reset-data': if(confirm('This permanently deletes all ASIF OS data from this browser. Export a backup first. Continue?')){localStorage.removeItem(STORAGE_KEY);state=starterData();saveState();render();toast('Workspace reset to starter data.');}break;
      case 'restore-starter': if(confirm('Replace all current data with the starter workspace? Export a backup first if needed.')){state=starterData();saveState();render();toast('Starter workspace restored.');}break;
      case 'set-theme': state.theme=button.dataset.theme;saveState();render();break;
      case 'timer-dummy': break;
    }
  }

  document.addEventListener('click',handleClick);
  document.addEventListener('submit',event=>{
    if(event.target.id==='entityForm'){event.preventDefault();handleFormSubmit(event.target);}
    if(event.target.id==='reviewForm'){event.preventDefault();const data=Object.fromEntries(new FormData(event.target).entries());state.weeklyReview=data;saveState();closeModal();toast('Weekly review saved.');}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='taskSearch'){taskSearch=event.target.value;const start=event.target.selectionStart;render();const input=$('#taskSearch');if(input){input.focus();input.setSelectionRange(start,start);}}
  });
  $('#themeToggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';saveState();render();});
  $('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#globalSearch').addEventListener('input',event=>{
    const results=searchWorkspace(event.target.value);
    let box=$('#searchResults');
    if(!box){box=document.createElement('div');box.id='searchResults';box.className='search-results';$('.search-box').parentElement.classList.add('search-wrap');$('.search-box').parentElement.appendChild(box);}
    box.innerHTML=results.length?results.map((result,index)=>`<button class="search-result" data-search-index="${index}">${escapeHtml(result.name)}<small>${result.type}</small></button>`).join(''):`<div class="search-result muted">${event.target.value.trim()?'No matches found.':'Type to search.'}</div>`;
    box._results=results;
  });
  $('#globalSearch').addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.target.value='';$('#searchResults')?.remove();event.target.blur();}
    if(event.key==='Enter'){const result=$('#searchResults')?._results?.[0];if(result){currentView=result.view;$('#searchResults')?.remove();event.target.value='';render();}}
  });
  document.addEventListener('click',event=>{
    const resultButton=event.target.closest('[data-search-index]');
    if(resultButton){const box=$('#searchResults');const result=box?._results?.[Number(resultButton.dataset.searchIndex)];if(result){currentView=result.view;$('#globalSearch').value='';box.remove();render();}}
    else if(!event.target.closest('.search-wrap')) $('#searchResults')?.remove();
  });
  document.addEventListener('change',event=>{ if(event.target.id==='importFile'){ importData(event.target.files?.[0]); event.target.value=''; } });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('#globalSearch').focus();}
    if(event.key==='Escape' && $('#modalRoot').innerHTML) closeModal();
  });

  // Optional offline caching when served from localhost or HTTPS. The app still works without it.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  render();
})();
