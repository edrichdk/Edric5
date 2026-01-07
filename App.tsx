
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  MessageSquare, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Search, 
  Users, 
  Send, 
  Calendar, 
  Clock,
  MoreVertical,
  ChevronRight,
  Target,
  Trophy,
  Activity,
  Layers,
  Zap,
  Shield
} from 'lucide-react';
import { User, Group, Message, Project, Task, TaskStatus } from './types';

// Mock Data Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Group State
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Tab State: 'chat' | 'projects'
  const [activeTab, setActiveTab] = useState<'chat' | 'projects'>('chat');

  // Messages, Projects, Tasks
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Derived State
  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId), [groups, activeGroupId]);
  const groupMessages = useMemo(() => messages.filter(m => m.groupId === activeGroupId), [messages, activeGroupId]);
  const groupProjects = useMemo(() => projects.filter(p => p.groupId === activeGroupId), [projects, activeGroupId]);

  // Auth Logic Mock
  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const mockUser: User = {
        uid: 'user-1',
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: 'https://picsum.photos/seed/user1/200'
      };
      setCurrentUser(mockUser);
      setIsLoggingIn(false);
      
      // Load initial mock group
      const demoGroup: Group = {
        id: 'group-1',
        name: 'Product Design Team',
        description: 'Building the next generation of social apps',
        createdBy: 'user-1',
        members: ['user-1'],
        inviteCode: 'DESIGN2024',
        createdAt: Date.now()
      };
      setGroups([demoGroup]);
      setActiveGroupId(demoGroup.id);

      // Load initial mock project
      const demoProject: Project = {
        id: 'project-1',
        groupId: 'group-1',
        title: 'Launch MVP v1.0',
        description: 'Complete all features for the initial public release.',
        deadline: Date.now() + 86400000 * 5, // 5 days from now
        createdAt: Date.now()
      };
      setProjects([demoProject]);

      // Load initial tasks
      setTasks([
        { id: 'task-1', projectId: 'project-1', title: 'Setup Database', status: TaskStatus.COMPLETED, assignedTo: ['user-1'] },
        { id: 'task-2', projectId: 'project-1', title: 'Design Auth Flow', status: TaskStatus.IN_PROGRESS, assignedTo: ['user-1'] },
        { id: 'task-3', projectId: 'project-1', title: 'Deploy to Cloud', status: TaskStatus.PENDING, assignedTo: ['user-1'] },
      ]);
    }, 1500);
  };

  const handleCreateGroup = (name: string, desc: string) => {
    if (!currentUser) return;
    const newGroup: Group = {
      id: generateId(),
      name,
      description: desc,
      createdBy: currentUser.uid,
      members: [currentUser.uid],
      inviteCode: Math.random().toString(36).substring(7).toUpperCase(),
      createdAt: Date.now()
    };
    setGroups([...groups, newGroup]);
    setActiveGroupId(newGroup.id);
    setShowCreateGroup(false);
  };

  const sendMessage = (text: string) => {
    if (!currentUser || !activeGroupId || !text.trim()) return;
    const newMessage: Message = {
      id: generateId(),
      groupId: activeGroupId,
      text,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhoto: currentUser.photoURL,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
  };

  const createProject = (title: string, desc: string, days: number) => {
    if (!activeGroupId) return;
    const newProj: Project = {
      id: generateId(),
      groupId: activeGroupId,
      title,
      description: desc,
      deadline: Date.now() + (86400000 * days),
      createdAt: Date.now()
    };
    setProjects([...projects, newProj]);
  };

  const addTask = (projectId: string, title: string) => {
    const newTask: Task = {
      id: generateId(),
      projectId,
      title,
      status: TaskStatus.PENDING,
      assignedTo: [currentUser?.uid || '']
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden font-inter">
        {/* Background Gradients for Mobile App Vibe */}
        <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-sm px-8 z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          {/* App Branding */}
          <div className="mb-12 flex flex-col items-center text-center space-y-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 rounded-3xl shadow-2xl shadow-indigo-500/30 transform rotate-12">
              <MessageSquare className="text-white" size={42} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-white italic">SyncGroup</h1>
              <p className="text-slate-400 text-sm font-medium">Coordinate. Chat. Complete.</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Welcome Back</h2>
                <p className="text-slate-500 text-xs px-4">Use your Google account to access your team workspace.</p>
              </div>

              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-4 bg-white text-slate-950 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition-all duration-300 disabled:opacity-70 active:scale-[0.98] shadow-lg"
              >
                {isLoggingIn ? (
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full gap-3">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Team Sync</span>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                
                <div className="flex gap-4">
                   <div className="p-2 bg-slate-800/50 rounded-lg"><Zap size={14} className="text-indigo-400" /></div>
                   <div className="p-2 bg-slate-800/50 rounded-lg"><Shield size={14} className="text-indigo-400" /></div>
                   <div className="p-2 bg-slate-800/50 rounded-lg"><Target size={14} className="text-indigo-400" /></div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-[10px] text-slate-600 text-center uppercase tracking-tighter leading-relaxed">
            By signing in you accept our enterprise <br/> 
            <span className="text-slate-400 font-bold">Terms of Service</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden">
      {/* Group Sidebar */}
      <nav className="w-20 md:w-72 border-r border-slate-900 flex flex-col h-full bg-slate-950/50 backdrop-blur-xl">
        <div className="p-4 flex items-center justify-between border-b border-slate-900">
          <h2 className="hidden md:block font-bold text-lg text-indigo-400">SyncGroup</h2>
          <div className="bg-slate-900 p-2 rounded-lg text-indigo-400">
            <Activity size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-2">
            <p className="hidden md:block text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">Groups</p>
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => { setActiveGroupId(group.id); setActiveTab('chat'); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeGroupId === group.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {group.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left truncate">
                  <p className="font-semibold text-sm truncate">{group.name}</p>
                  <p className="text-xs opacity-60">12 members</p>
                </div>
              </button>
            ))}
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-400/50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center shrink-0">
                <Plus size={20} />
              </div>
              <p className="hidden md:block text-sm font-medium">New Group</p>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <img src={currentUser.photoURL} className="w-10 h-10 rounded-xl" alt="profile" />
            <div className="hidden md:block truncate">
              <p className="text-sm font-semibold truncate">{currentUser.displayName}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center gap-3 p-2 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-950">
        {activeGroup ? (
          <>
            {/* Header */}
            <header className="h-16 border-b border-slate-900 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg">{activeGroup.name}</h3>
                <div className="flex bg-slate-900 rounded-lg p-1">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare size={16} />
                    Chat
                  </button>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckSquare size={16} />
                    Projects
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/${i + 10}/100`} 
                      className="w-8 h-8 rounded-full border-2 border-slate-950" 
                      alt="avatar" 
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    +9
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all">
                  <Settings size={20} />
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' ? (
                <ChatView messages={groupMessages} currentUser={currentUser} onSend={sendMessage} />
              ) : (
                <ProjectView 
                  projects={groupProjects} 
                  tasks={tasks} 
                  onCreateProject={createProject}
                  onAddTask={addTask}
                  onUpdateTask={updateTaskStatus}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="p-6 rounded-full bg-slate-900">
              <Users size={48} />
            </div>
            <p className="text-lg">Select a group to start collaborating</p>
          </div>
        )}
      </main>

      {/* Modal: Create Group */}
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)} 
          onCreate={handleCreateGroup} 
        />
      )}
    </div>
  );
};

/** 
 * ChatView Component
 */
const ChatView: React.FC<{ 
  messages: Message[], 
  currentUser: User, 
  onSend: (text: string) => void 
}> = ({ messages, currentUser, onSend }) => {
  const [input, setInput] = useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
            <div className="p-4 bg-slate-900 rounded-2xl">
              <MessageSquare size={32} />
            </div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.senderId === currentUser.uid ? 'flex-row-reverse' : ''}`}>
            <img src={msg.senderPhoto} className="w-10 h-10 rounded-xl shrink-0" alt="sender" />
            <div className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">{msg.senderName}</span>
                <span className="text-[10px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-sm sm:max-w-md ${
                msg.senderId === currentUser.uid ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button type="submit" className="bg-indigo-600 p-3 rounded-xl hover:bg-indigo-500 transition-all text-white">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

/** 
 * ProjectView Component
 */
const ProjectView: React.FC<{
  projects: Project[],
  tasks: Task[],
  onCreateProject: (title: string, desc: string, days: number) => void,
  onAddTask: (projectId: string, title: string) => void,
  onUpdateTask: (taskId: string, status: TaskStatus) => void
}> = ({ projects, tasks, onCreateProject, onAddTask, onUpdateTask }) => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);
  const completedTasksCount = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progressPercent = projectTasks.length > 0 ? (completedTasksCount / projectTasks.length) * 100 : 0;

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {/* Project Sidebar */}
      <div className="w-80 border-r border-slate-900 flex flex-col h-full bg-slate-950/30">
        <div className="p-4 flex items-center justify-between">
          <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Active Projects</h4>
          <button 
            onClick={() => setShowAddProject(true)}
            className="p-1 hover:bg-slate-900 text-indigo-400 rounded transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`w-full p-4 rounded-xl text-left border transition-all ${
                selectedProjectId === p.id 
                  ? 'bg-slate-900 border-indigo-600/50 ring-1 ring-indigo-500/10' 
                  : 'border-transparent hover:bg-slate-900/50'
              }`}
            >
              <h5 className="font-semibold text-sm mb-1">{p.title}</h5>
              <p className="text-xs text-slate-500 truncate mb-3">{p.description}</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${tasks.filter(t => t.projectId === p.id && t.status === TaskStatus.COMPLETED).length / (tasks.filter(t => t.projectId === p.id).length || 1) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Detail Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeProject ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
            <header className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{activeProject.title}</h2>
                  <p className="text-slate-400">{activeProject.description}</p>
                </div>
                <div className="text-right">
                  <Countdown deadline={activeProject.deadline} />
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Progress</p>
                  <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tasks</p>
                  <p className="text-2xl font-bold">{completedTasksCount}/{projectTasks.length}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Completion status</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${progressPercent === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                    <span className="text-lg font-bold">{progressPercent === 100 ? 'Completed' : 'In Progress'}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Task Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <CheckSquare size={18} className="text-indigo-400" />
                  Tasks Breakdown
                </h3>
              </div>

              <div className="space-y-3">
                {projectTasks.map(task => (
                  <div key={task.id} className="group bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-indigo-600/30 transition-all">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onUpdateTask(task.id, task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED)}
                        className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                          task.status === TaskStatus.COMPLETED ? 'bg-indigo-600 border-indigo-600' : 'border-slate-700 hover:border-indigo-500'
                        }`}
                      >
                        {task.status === TaskStatus.COMPLETED && <CheckSquare size={12} className="text-white" />}
                      </button>
                      <span className={`text-sm ${task.status === TaskStatus.COMPLETED ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <select 
                        value={task.status}
                        onChange={(e) => onUpdateTask(task.id, e.target.value as TaskStatus)}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-slate-800 bg-slate-900 focus:outline-none ${
                          task.status === TaskStatus.COMPLETED ? 'text-emerald-400 bg-emerald-400/10' :
                          task.status === TaskStatus.IN_PROGRESS ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500'
                        }`}
                      >
                        <option value={TaskStatus.PENDING}>Pending</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                      </select>
                      <img src={`https://picsum.photos/seed/${task.id}/100`} className="w-6 h-6 rounded-full" alt="assigned" />
                    </div>
                  </div>
                ))}

                <AddTaskInput onAdd={(title) => onAddTask(activeProject.id, title)} />
              </div>
            </section>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="p-6 rounded-full bg-slate-900">
              <Trophy size={48} />
            </div>
            <p>No projects yet. Kickstart your first goal!</p>
            <button 
              onClick={() => setShowAddProject(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all"
            >
              Create Project
            </button>
          </div>
        )}
      </div>

      {showAddProject && (
        <CreateProjectModal 
          onClose={() => setShowAddProject(false)} 
          onCreate={(t, d, days) => { onCreateProject(t, d, days); setShowAddProject(false); }}
        />
      )}
    </div>
  );
};

/**
 * Countdown Component
 */
const Countdown: React.FC<{ deadline: number }> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<number>(deadline - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = deadline - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft <= 0) return <span className="text-rose-500 font-bold">Deadline Passed</span>;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  let colorClass = 'text-emerald-400';
  if (days < 1) colorClass = 'text-rose-500';
  else if (days < 3) colorClass = 'text-amber-400';

  return (
    <div className={`flex flex-col items-end ${colorClass}`}>
      <div className="flex items-center gap-1 font-bold text-xl">
        <Clock size={20} />
        {days}d {hours}h {mins}m
      </div>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Time Remaining</p>
    </div>
  );
};

/**
 * Modal Components
 */
const CreateGroupModal: React.FC<{ onClose: () => void, onCreate: (name: string, desc: string) => void }> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <h3 className="text-xl font-bold">Create New Group</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Group Name</label>
            <input 
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
              placeholder="e.g., Marketing Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-24 resize-none"
              placeholder="What is this group about?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium text-slate-400">Cancel</button>
          <button 
            disabled={!name.trim()}
            onClick={() => onCreate(name, desc)} 
            className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all font-medium disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateProjectModal: React.FC<{ onClose: () => void, onCreate: (t: string, d: string, days: number) => void }> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [days, setDays] = useState(7);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <h3 className="text-xl font-bold">Launch a Project</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Project Title</label>
            <input 
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
              placeholder="e.g., Q4 Roadmap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Target Deadline (Days)</label>
            <input 
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Objectives</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-24 resize-none"
              placeholder="What are the key goals?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium text-slate-400">Cancel</button>
          <button 
            disabled={!title.trim()}
            onClick={() => onCreate(title, desc, days)} 
            className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all font-medium disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTaskInput: React.FC<{ onAdd: (title: string) => void }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };
  return (
    <form onSubmit={handleAdd} className="mt-4">
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 pr-2">
        <input 
          className="flex-1 bg-transparent border-none px-4 py-2 focus:outline-none text-sm"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" disabled={!title.trim()} className="bg-slate-800 p-1.5 rounded-lg text-indigo-400 hover:bg-slate-700 transition-all disabled:opacity-50">
          <Plus size={18} />
        </button>
      </div>
    </form>
  );
};

export default App;
