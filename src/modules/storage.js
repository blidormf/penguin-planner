import Project from './project';
import { Task, PRIORITY } from './task';

let projects = [];

export const saveProjects = (projectsToSave) => {
    localStorage.setItem("projects", JSON.stringify(projectsToSave));
};

export const loadProjects = () => {
    const projectsJson = localStorage.getItem("projects");
    if (projectsJson) {
        const rawProjects = JSON.parse(projectsJson);
        projects = rawProjects.map(projectData => {
            const project = new Project(projectData.title, projectData.desc);
            project.tasks = projectData.tasks.map(taskData => {
                const task = new Task(
                    taskData.title,
                    new Date(taskData.dueDate),
                    taskData.priority,
                    taskData.desc
                );
                task.complete = taskData.complete;
                task.setProject(project);
                return task;
            });

            return project;
        });
    }
    return projects;
};