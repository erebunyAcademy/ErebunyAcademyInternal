export const QUERY_KEY = {
  allStudents: (search: string, page: number) => [search ? `users/${search}` : 'users', page],
  allExams: (search: string, page: number, sortBy: string, orderBy: string) => [
    search ? `exams/${search}` : 'exams',
    page,
    sortBy,
    orderBy,
  ],
  allFaculties: (search: string, page: number) => [
    search ? `faculties/${search}` : 'faculties',
    page,
  ],
  allTeachers: (search: string, page: number) => [search ? `teachers/${search}` : 'teachers', page],
  allSubjects: (search: string, page: number) => [search ? `subjects/${search}` : 'subjects', page],
  allCourses: (search: string, page: number) => [
    search ? `student-grades/${search}` : 'student-grades',
    page,
  ],
  allCourseGroups: (search: string, page: number) => [
    search ? `student-grade-groups/${search}` : 'student-grade-groups',
    page,
  ],
};
