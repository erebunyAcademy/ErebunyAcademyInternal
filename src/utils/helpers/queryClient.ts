export const QUERY_KEY = {
  allStudents: (search: string, page: number) => [search ? `users/${search}` : 'users', page],
  allExams: (search: string, page: number) => [search ? `exams/${search}` : 'exams', page],
  allFaculties: (search: string, page: number) => [
    search ? `faculties/${search}` : 'faculties',
    page,
  ],
  allTeachers: (search: string, page: number) => [search ? `teachers/${search}` : 'teachers', page],
  allSubjects: (search: string, page: number) => [search ? `subjects/${search}` : 'subjects', page],
  allStudentGrades: (search: string, page: number) => [
    search ? `student-grades/${search}` : 'student-grades',
    page,
  ],
  allStudentGradeGroups: (search: string, page: number) => [
    search ? `student-grade-groups/${search}` : 'student-grade-groups',
    page,
  ],
};
