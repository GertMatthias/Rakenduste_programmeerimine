import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <TaskCard />
      </main>
    </div>
  );
}

export default App;
