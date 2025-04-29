import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiUrl = 'http://localhost:3000/courses';

  constructor(private readonly http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  postCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  deleteCourse(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateCourse(course: Course): Observable<Course>{
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }
}
