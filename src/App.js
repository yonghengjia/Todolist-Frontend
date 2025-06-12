import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState(''); // 输入框的内容
  const [todos, setTodos] = useState([]); // 所有待办事项的数组
  const [editId, setEditId] = useState(null);//当前正在编辑的todo id
  const [editText, setEditText] = useState('');//当前编辑输入框内容

  //页面加载时请求后段数据
  useEffect(() => {
    axios.get('http://localhost:3000/todos') //链接后端
      .then(response => {
        setTodos(response.data);//设置为后端返回的列表
      })
      .catch(error => {
        console.error('Failed to obtain todos:', error)
      });
  }, []);//空依赖数组 =页面首次加载时执行一次
  
  // 点击添加按钮时触发
  const handleAdd = () => {
    if (text.trim() === '') return;
    axios.post('http://localhost:3000/todos', { text })
      .then((response) => {
        //后端返回新添加的todo，更新到前端列表中
        setTodos([...todos, response.data]);
        setText('');
      })
      .catch((error) => {
        console.error('Failure to add todo', error)
      });
  };

  //添加delete函数
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
        // 删除后刷新列表（过滤掉被删的那条）
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('删除 todo 失败:', error);
      });
  };
  
  //添加handleEdit,handleUpdate方法
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.id);
  };
  const handleUpdate = (id) => {
    if (editText.trim() === '') return;
    axios.put(`http://localhost:3000/todos/${id}`, { text: editText })
      .then(res => {
        const updated = todos.map(todo =>
          todo.id === id ? res.data : todo
        );
        setTodos(updated);
        setEditId(null);
        setEditText('');
      })
      .catch(err => console.error('Failure to update', err));
  };




  return (
    <div 
      className='App'
      style={{ 
        padding: '2rem', 
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#fdfdfd',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial',
      }}>

      <h1>📝 To-Do-List</h1>

      {/* 输入框 */}
      <input
        type="text"
        placeholder="Please enter the to-do items"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
      />

      {/* 添加按钮 */}
      <button 
        onClick={handleAdd} 
        style={{ 
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
        Add
      </button>

      <hr />

      {/* 渲染 Todo 列表 */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
            {editId === todo.id ? (
              <>
                <input
                  value = {editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style = {{ padding: '0.25rem', width: '250px' }}
                />
                <button onClick={() => handleUpdate(todo.id)} style = {{ marginLeft: '0.5rem' }}>Save</button>
                <button onClick={() => setEditId(null)} style = {{ marginLeft: '0.5rem' }}>Cancel</button>
              </>
            ) : (
              <>
                {todo.text}
                <button onClick={() => handleEdit(todo)} style = {{ marginLeft: '1rem' }}>Edit</button>
                <button onClick={() => handleDelete(todo.id)} style = {{ marginLeft: '0.5rem' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
