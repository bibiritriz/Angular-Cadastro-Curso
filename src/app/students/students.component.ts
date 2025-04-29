import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../courses/course.model';
import { CourseService } from '../courses/course.service';
import { Student } from './student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  show: boolean = false;
  formGroupStudent: FormGroup;

  constructor(
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
    private readonly formBuilder: FormBuilder
  ) {
    this.formGroupStudent = formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      course: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => (this.courses = data),
    });

    this.studentService.getStudents().subscribe({
      next: (json) => (this.students = json),
    });
  }

  saveStudent() {
    if (this.formGroupStudent.get('course')?.value == null) {
      this.formGroupStudent.patchValue({
        course: this.courses[0],
      });
    }

    if (this.formGroupStudent.valid) {
      console.log('Valido');
      if (this.formGroupStudent.get('id')?.value) {
        this.studentService
          .updateStudent(this.formGroupStudent.value)
          .subscribe({
            next: (student) => {
              const indice = this.students.findIndex(
                (s) => s.id === student.id
              );
              if (indice > -1) {
                this.students[indice] = student;
              }
            },
          });
      } else {
        this.studentService.postStudent(this.formGroupStudent.value).subscribe({
          next: (json) => {
            this.students.push(json);
            this.formGroupStudent.reset({
              course: null,
            });
          },
        });
      }
      this.formGroupStudent.reset({
        course: null,
      });
      this.show = false;
    } else {
      window.alert('Não foi possível salvar o estudante.');
    }
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        const indice = this.students.findIndex((s) => s.id === id);
        if (indice > -1) {
          this.students.splice(indice, 1);
        }
        this.formGroupStudent.reset({
          course: null,
        });
        this.show = false;
      },
    });
  }

  updateStudent(student: Student) {
    const selectedCourse = this.courses.find(
      (c) => Number(c.id) === Number(student.course.id)
    );
    if (selectedCourse === undefined) {
      window.alert('Curso desse estudante não foi encontrado.');
    }
    this.formGroupStudent.setValue({
      ...student,
      course:
        selectedCourse === this.courses[0]
          ? null
          : selectedCourse === undefined
          ? null
          : selectedCourse,
    });
    selectedCourse === undefined ? (this.show = false) : (this.show = true);
  }

  cancel() {
    this.show = false;
    this.formGroupStudent.reset({
      course: null,
    });
  }
}
