import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Check, X, ListTodo, CheckCircle2 } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId !== null) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'pending') return !todo.completed && matchesSearch;
    if (activeTab === 'completed') return todo.completed && matchesSearch;
    return matchesSearch;
  });

  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Task Manager</h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </form>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
            >
              <ListTodo size={20} />
              All Tasks ({todos.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
            >
              <ListTodo size={20} />
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'completed' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
            >
              <CheckCircle2 size={20} />
              Completed ({completedCount})
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredTodos.map(todo => (
              <div key={todo.id} className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 ${todo.completed ? 'bg-green-50' : 'bg-white'}`}>
                <button onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${todo.completed ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                  {todo.completed && <Check size={14} />}
                </button>
                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-700"><Check size={20} /></button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:text-red-700"><X size={20} /></button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{todo.text}</span>
                    <button onClick={() => startEditing(todo)} className="p-1 text-blue-600 hover:text-blue-700"><Edit2 size={20} /></button>
                    <button onClick={() => deleteTodo(todo.id)} className="p-1 text-red-600 hover:text-red-700"><Trash2 size={20} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;