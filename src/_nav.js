import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCursor, cilPuzzle, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Domains',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Domain List',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'New Domain',
        to: '/forms/form-control',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Request',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pending Request',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'All Requests',
        to: '/buttons/dropdowns',
      },
    ],
  },
]

export default _nav
