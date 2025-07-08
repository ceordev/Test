import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '../models/task.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, ReactiveFormsModule]

})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage: string | null = null;
  filterStatus: string = '';
  searchTerm: string = '';

  constructor(private tasksService: TasksService, private router: Router) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.errorMessage = null;
    this.tasksService.getTasks({ status: this.filterStatus, search: this.searchTerm }).subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'No se encontraron tareas.';
        console.error('No hay nada que mostrar:', error);
      }
    );
  }

  onFilterChange(): void {
    this.fetchTasks();
  }

  onSearchChange(): void {
    this.fetchTasks();
  }

  onCreateTask(newTask: { title: string; description: string }): void {
    this.tasksService.createTask(newTask).subscribe(
      (task) => {
        this.tasks.push(task); // Añade la nueva tarea a la lista
        // Opcional: limpiar el formulario o mostrar un mensaje de éxito
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Error al crear tarea.';
        console.error('Error al crear tarea:', error);
      }
    );
  }

  onUpdateStatus(id: number, status: 'OPEN' | 'IN_PROGRESS' | 'DONE'): void {
    this.tasksService.updateTaskStatus(id, status).subscribe(
      (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask; // Actualiza la tarea en la lista
        }
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Error al actualizar.';
        console.error('Error al actualizar:', error);
      }
    );
  }

  onDeleteTask(id: number): void {
    if (confirm('Estás seguro que quieres eliminar?')) {
      this.tasksService.deleteTask(id).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task.id !== id); // Elimina la tarea de la lista
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'Error al eliminar tarea.';
          console.error('Error al eliminar tarea:', error);
        }
      );
    }
  }
}