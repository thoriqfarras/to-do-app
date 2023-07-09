import Project from './project.js';
import Task from './task.js';

export default function AppController() {
  let projects = [new Project('inbox')];

  // task controls
  function addTask(taskInfo) {
    const task = new Task(taskInfo);
    let targetProject = projects.find(p => p.name === task.project);
    if (!targetProject) {
      console.log(`project '${task.project}' doesn't exist. creating...`);
      addProject(task.project);
      targetProject = projects.at(-1);
    }
    targetProject.addTask(task);
  }

  function editTask(task, { ...args }) {
    task.edit({ ...args });
  }

  function removeTask(task) {
    for (const project of projects) {
      if (project.getTasks().includes(task)) {
        project.removeTask(task);
        return;
      }
    }
    console.log(`${task.name} is not found`);
  }

  function getAllTasks() {
    let allTasks = [];
    projects.forEach(project => {
      const tasks = project.getTasks();
      allTasks.push(...tasks);
    });
    return allTasks;
  }

  // project controls
  function addProject(name) {
    projects.push(new Project(name));
    console.log(`project '${name}' added`);
  }

  function getProjects() {
    return projects;
  }

  return {
    addTask,
    editTask,
    removeTask,
    addProject,
    getProjects,
  };
}