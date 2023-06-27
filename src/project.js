export default class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  getName() { return this.name };

  setName(name) { this.name = name };

  getTask(task) { 
    return tasks.find(t => t === task) 
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

  getTasks() { return this.tasks };
}