import { baselineQuestions, riskQuestions } from './questions.js';

export const routes = [
  { path: 'welcome', type: 'screen', title: 'Welcome' },
  ...baselineQuestions.map((question) => ({
    path: question.route,
    type: 'baseline',
    id: question.id,
    title: question.title
  })),
  { path: 'risk-intro', type: 'screen', title: 'Project risk questions' },
  ...riskQuestions.map((question) => ({
    path: `risk/${question.route}`,
    type: 'risk',
    id: question.id,
    title: question.title
  })),
  { path: 'commercial', type: 'commercial', title: 'Commercial inputs' },
  { path: 'results', type: 'results', title: 'Results' },
  { path: 'how-it-works', type: 'screen', title: 'How it works' }
];

export function getRoute(path) {
  return routes.find((route) => route.path === path) || routes[0];
}

export function getCurrentPath() {
  return window.location.hash.replace(/^#\/?/, '') || 'welcome';
}

export function navigate(path) {
  window.location.hash = `#/${path}`;
}

export function getProgress(path) {
  const ordered = routes.filter((route) => route.path !== 'how-it-works');
  const currentIndex = Math.max(0, ordered.findIndex((route) => route.path === path));
  return {
    current: currentIndex + 1,
    total: ordered.length,
    percent: Math.round(((currentIndex + 1) / ordered.length) * 100)
  };
}
