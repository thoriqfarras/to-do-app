import './style.css';
import Task from './task.js';
import AppController from './todolist';
import App from './ui.js';

const app = App();

// document.body.appendChild(App); 

// const app = AppController();
// const projects = app.getProjects();

// app.addTask(new Task({
//   name: 'Work on to do app',
//   project: 'webdev',
//   due: new Date(2023, 6, 30),
// }));

// app.editTask(projects.at(1).getTasks().at(0), { status: 'done', name: 'create ui for to do app', due: new Date() });
// // app.removeTask(projects.at(1).tasks.at(0));

// const mopHouse = new Task({
//   name: 'mop house',
//   project: 'life',
// });
// app.addProject('life');
// app.addTask(mopHouse);
// app.removeTask(mopHouse);

// console.log(projects);