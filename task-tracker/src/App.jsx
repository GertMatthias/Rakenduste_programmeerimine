import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import './App.css';

function App() {
  const firstTask = {
    id: 1,
    title: 'Learn JSX',
    completed: true,
  };

  const secondTask = {
    id: 2,
    title: 'Practise React state',
    completed: false,
  };

  return (
    <div className="app">
      <Header />
      <main>
        <TaskCard task={firstTask} />
        <TaskCard task={secondTask} />
      </main>
    </div>
  );
}

export default App;
