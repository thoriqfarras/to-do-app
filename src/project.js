export default class Project {
  constructor(title, color='') {
    this.title = title;
    this.color = color || '#' + Math.floor(Math.random()*16777215).toString(16);
    this._tasks = [];
  }

  edit({ title, color }) {
    this.title = title || this.title;
    this.color = color || this.color;
    this._tasks.forEach(task => {
      task.edit({ project: this.title, projectColor: this.color });
    });
  }

  addTask(task) {
    this._tasks.push(task);
    console.log(`${task.title} added to ${this.title}`);
  }

  removeTask(task) {
    this._tasks = this._tasks.filter(t => t !== task);
    console.log(`${task.name} deleted from ${this.title}`);
  }

  getTasks() { return this._tasks }; 
}