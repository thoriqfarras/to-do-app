export default class Task {
  constructor({ 
    name, 
    status = 'todo', 
    due, 
    project = 'inbox', 
    priority = 0, 
    note = ''
  }) {
    this.name = name;
    this.status = status;
    this.due = due;
    this.project = project;
    this.priority = priority;
    this.note = note;
  }

  // getters
  getName() { return this.name };

  getStatus() { return this.status };

  getDue() { return this.due };

  getProject() { return this.project };

  getPriority() { return this.priority };

  getNote() { return this.note };

  // setters
  setName(name) { this.name = name };
  
  setStatus(status) { this.status = status };

  setDue(due) { this.due = due};

  setProject(project) { this.project = project };

  setPriority(priority) { this.priority = priority };

  setNote(note) { this.note = note };
}