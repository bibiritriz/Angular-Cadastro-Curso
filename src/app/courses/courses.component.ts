import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from './course.model';
import { CourseService } from './course.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  show: boolean = false;
  FormGroupCourse: FormGroup;

  constructor(
    private readonly service: CourseService,
    private readonly formBuilder: FormBuilder
  ) {
    this.FormGroupCourse = formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      active: [true],
      promotion: [false],
    });
  }

  ngOnInit(): void {
    this.service.getCourses().subscribe({
      next: (json) => (this.courses = json),
    });
  }

  saveCourse() {
    if (this.FormGroupCourse.valid) {
      if(this.FormGroupCourse.get('id')?.value){
        this.service.updateCourse(this.FormGroupCourse.value).subscribe({
          next: course => {
            const indice = this.courses.findIndex(c => c.id === course.id);
            if(indice > -1){
              this.courses[indice] = course;
            this.FormGroupCourse.reset({
              active: true
            })
            this.show = false;
          }}});
      }else{
        this.service.postCourse(this.FormGroupCourse.value).subscribe({
          next: (json) => {
            console.log(json)
            this.courses.push(json);
            this.FormGroupCourse.reset({
              active: true
            });
          },
        });
      }
    } else {
      window.alert('Não foi possível salvar o curso.');
    }
  }

  deleteCourse(id: number){
    this.service.deleteCourse(id).subscribe({
      next: () => {
        const indice = this.courses.findIndex(c => c.id === id);
        if(indice > -1){
          this.courses.splice(indice, 1);
        }
        this.FormGroupCourse.reset({
          active: true
        });
        this.show = false;  
      }
    });
  }

  updateCourse(course: Course){
    this.show = true;
    this.FormGroupCourse.setValue(course);
  }

  cancelar(){
    this.show = false;
    this.FormGroupCourse.reset({
    active: true
    });
  }
}
