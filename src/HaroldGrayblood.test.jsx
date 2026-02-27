// src/HaroldGrayblood.test.jsx
import { render } from '@testing-library/react'
import HaroldGrayblood from './HaroldGrayblood.jsx'

test('renders without crashing', () => {
  const { container } = render(<HaroldGrayblood />)
  expect(container.firstChild).not.toBeNull()
})
