import { useEffect, useState } from 'react'
import './App.css'
import { useTheme } from './ThemeContext'

interface TodoItem {
  id: string,
  text: string,
  completed: boolean
}

function App() {
  //Keys
  const keyTaksMemory: string = "tasks"

  //States
  const {theme, toggleTheme} = useTheme()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState<boolean>(false) //Buscar dados da memória 
  
  // Functions
  const addTodo = (): void => {
    if(newTodo !== "") {
      const newId = crypto.randomUUID()
      const newTodoItem: TodoItem = {
        id: newId,
        text: newTodo,
        completed: false
      }
      setTodos([...todos, newTodoItem])
      setNewTodo("")
    }
  }

  const removeTask = (id:string): void => {
    const updatedTasks = todos.filter((todo) => todo.id !== id)
    setTodos(updatedTasks)
  }

  const markDone = (id: string): void => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  const getCompletedTasks = (): TodoItem[] => {
    return todos.filter(todo => todo.completed)
  }

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem(keyTaksMemory, JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  useEffect(() => {
    const tasksFromMemory = localStorage.getItem(keyTaksMemory)

    if(tasksFromMemory) {
      setTodos(JSON.parse(tasksFromMemory))
    }

    setIsLoaded(true)

  }, [])

  return (
    <>
      <div className={`app ${theme}`}>
        <div className={`container ${theme}`}>
          <h1>Lista de Tarefas - {getCompletedTasks().length} / {todos.length}</h1>
          <div className='input-container'>
            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <button onClick={addTodo}>Adicionar Tarefa</button>
          </div>
          <ol>
            {
              todos.map((todo) => (
                <li key={todo.id}>
                  <input type="checkbox" checked={todo.completed} onChange={() => markDone(todo.id)} />
                  <span style={{ textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.text}</span>
                  <button onClick={() => removeTask(todo.id)}>Remover</button>
                </li>
              ))
            }
          </ol>
          <button onClick={toggleTheme}>
            Alterar para o tema { theme === 'light' ? 'Escuro' : 'Claro'}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
