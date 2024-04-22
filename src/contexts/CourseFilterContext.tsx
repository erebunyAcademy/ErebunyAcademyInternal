'use client';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

export type Course = {
  id: number;
  name: string;
  value: string;
  filterBy: 'duration' | 'title' | 'skill-level';
};

type CourseFilterState = {
  courseNames: Course[];
  setCourseNameHandler: (course: Course) => void;
  setFilteredCourseHandler: (course: Course) => void;
  removeCourseNameHandler: (courseId: number) => void;
  enableOnChangeRequest: boolean;
  changeEnableOnChangeRequest: () => void;
  applyFilterHandler: () => void;
  resetFilterHandler: () => void;
};

const CourseFilterContext = createContext<CourseFilterState | undefined>(undefined);

export const CourseFilterProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [enableOnChangeRequest, setEnableOnChangeRequest] = useState<boolean>(false);
  const [courseNames, setCourseNames] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);

  const setCourseNameHandler = useCallback((course: Course) => {
    setCourseNames(prevCourseNames => [...prevCourseNames, course]);
  }, []);

  const setFilteredCourseHandler = useCallback((course: Course) => {
    setFilteredData(prevCourseNames => [...prevCourseNames, course]);
  }, []);

  const removeCourseNameHandler = useCallback((courseId: number) => {
    setCourseNames(prevCourseNames => prevCourseNames.filter(({ id }) => id !== courseId));
    setFilteredData(prevCourseNames => prevCourseNames.filter(({ id }) => id !== courseId));
  }, []);

  const changeEnableOnChangeRequest = useCallback(() => {
    setEnableOnChangeRequest(prevState => !prevState);
  }, []);

  const applyFilterHandler = useCallback(() => {
    setCourseNames(filteredData);
  }, [filteredData]);

  const resetFilterHandler = useCallback(() => {
    setFilteredData([]);
  }, []);

  return (
    <CourseFilterContext.Provider
      value={{
        courseNames,
        setCourseNameHandler,
        removeCourseNameHandler,
        enableOnChangeRequest,
        changeEnableOnChangeRequest,
        setFilteredCourseHandler,
        applyFilterHandler,
        resetFilterHandler,
      }}>
      {children}
    </CourseFilterContext.Provider>
  );
};

export const useCourseFilter = (): CourseFilterState => {
  const context = useContext(CourseFilterContext);

  if (!context) {
    throw new Error('useCourseFilter must be used within a CourseFilterProvider');
  }

  return context;
};
