import {
  Outlet,
  RouterProvider,
  Route,
  RootRoute,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { getUserFromToken } from '../utils/auth';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CreateCourse from '../pages/CreateCourse';
import AddModule from '../pages/AddModule';
import AddLesson from '../pages/AddLesson';
import CourseContent from '../pages/CourseContent';
import AvailableCourses from '../pages/AvailableCourses';



const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({ path: '/', getParentRoute: () => rootRoute, component: Home });
const loginRoute = createRoute({ path: '/login', getParentRoute: () => rootRoute, component: Login });
const registerRoute = createRoute({ path: '/register', getParentRoute: () => rootRoute, component: Register });
const dashboardRoute = createRoute({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const user = getUserFromToken();
    if (!user) {
      throw new Error('UNAUTHORIZED'); // Will be caught by router
    }
  },
  component: Dashboard,
});

const createCourseRoute = createRoute({
  path: '/create-course',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'instructor') {
      throw new Error('UNAUTHORIZED');
    }
  },
  component: CreateCourse,
});

const addModuleRoute = createRoute({
  path: '/add-module',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'instructor') {
      throw new Error('UNAUTHORIZED');
    }
  },
  component: AddModule,
});

const addLessonRoute = createRoute({
  path: '/add-lesson',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'instructor') {
      throw new Error('UNAUTHORIZED');
    }
  },
  component: AddLesson,
});

const courseContentRoute = createRoute({
  path: '/course/$courseId',
  getParentRoute: () => rootRoute,
  beforeLoad: ({ params }) => {
    const user = getUserFromToken();
    if (!user || user.role !== 'student') {
      throw new Error('UNAUTHORIZED');
    }
  },
  component: CourseContent,
});

const availableCoursesRoute = createRoute({
  path: '/courses',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'student') {
      throw new Error('UNAUTHORIZED');
    }
  },
  component: AvailableCourses,
});

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, registerRoute, dashboardRoute, createCourseRoute, addModuleRoute, addLessonRoute, courseContentRoute, availableCoursesRoute]);

export const router = createRouter({ routeTree });

// Optional for dev tools
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      defaultErrorComponent={({ error }) => {
        if (error?.message === 'UNAUTHORIZED') {
          window.location.href = '/login'; // 🔁 redirect to login
        }
        return <div className="p-4 text-red-600">Error: {error.message}</div>;
      }}
    />
  );
}

