import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
]

export default routes
