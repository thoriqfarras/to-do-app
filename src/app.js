import Task from './task.js';
import Project from './project.js';

export default function AppController() {
  let projects = [new Project('inbox')];
  let inbox = projects[0];

  function addTask({
    name, 
    status = 'todo', 
    due, 
    project = 'inbox', 
    priority = 0, 
    note = ''
  }) {
    const task = new Task({
      name, 
      status, 
      due, 
      project, 
      priority, 
      note
    });
    let targetProject = projects.find(p => p.getName() === project);
    if (!targetProject) {
      projects.push(new Project(task.project));
      targetProject = projects.at(-1);
    }
    targetProject.addTask(task);
    console.log(`${task.getName()} added to ${task.getProject()}`);
  }

  function removeTask(taskName) {
    for (const project of projects) {
      const task = project.tasks.find(task => taskName === task.getName());
      if (task) {
        project.removeTask(task);
        console.log(`${task.getName()} deleted from ${task.getProject()}`);
        return;
      }
    }
    console.log(`${taskName} is not found`);
  }

  return {
    addTask,
    removeTask,
    projects
  };
}