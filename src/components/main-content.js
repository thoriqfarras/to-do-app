import '../style.css';
import TaskItem from './taskItem.js';
import Footer from './footer.js';

export default function Main(activeProject) {
  const main = document.createElement('main');
  main.classList.add('main-content');
  
  const pageTitle = document.createElement('h1');
  const tasksList = document.createElement('ul');
  const footer = Footer();
  tasksList.classList.add('tasks');
  
  function loadProject(activeProject) {

    while (main.firstChild) {
      // console.log(main.firstChild);
      main.removeChild(main.firstChild);
      // break;
    }

    while (tasksList.firstChild) {
      tasksList.removeChild(tasksList.firstChild);
    }

    main.appendChild(pageTitle);
    main.appendChild(tasksList);
    main.appendChild(footer);

    pageTitle.innerText = activeProject.name;
    
    const tasks = activeProject.getTasks();
    tasks.forEach(task => {
      if (task.status === 'todo') {
        tasksList.appendChild(new TaskItem(task));
      }
    });
  }
  
  loadProject(activeProject);
  
  return { main, loadProject };
}