import { Course } from "../courses/course.model";

export interface Student {
  id: number;
  name: string;
  course: Course;
}
