import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildWorkspace } from '@/buffers'
import { Editor } from './Editor'

function setup() {
  window.history.replaceState(null, '', '/')
  const onLocaleChange = vi.fn()
  const user = userEvent.setup()
  render(<Editor workspace={buildWorkspace('en')} onLocaleChange={onLocaleChange} />)
  return { user, onLocaleChange }
}

const activeTab = () => screen.getByRole('link', { current: 'page' })

describe('<Editor />', () => {
  it('shows every section as a tab and README.md first', () => {
    setup()
    const tabs = within(screen.getByRole('navigation', { name: 'Tabs' })).getAllByRole('link')
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      '1 README.md',
      '2 experience.md',
      '3 projects.md',
      '4 stack.ts',
      '5 contact.md',
      '6 cv.pdf',
    ])
    expect(screen.getByRole('region', { name: 'README.md' })).toBeInTheDocument()
  })

  it('switches tabs with the keyboard and the mouse', async () => {
    const { user } = setup()
    await user.keyboard('gt')
    expect(activeTab()).toHaveTextContent('experience.md')
    expect(window.location.hash).toBe('#/experience')

    await user.click(screen.getByRole('link', { name: /stack\.ts/ }))
    expect(activeTab()).toHaveTextContent('stack.ts')
  })

  it('runs ex commands from the command line', async () => {
    const { user, onLocaleChange } = setup()
    await user.keyboard(':e proj{Enter}')
    expect(activeTab()).toHaveTextContent('projects.md')

    await user.keyboard(':set lang=es{Enter}')
    expect(onLocaleChange).toHaveBeenCalledWith('es')

    await user.keyboard(':nope{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent('E492: Not an editor command: nope')
  })

  it('lets visitors type in the contact form and leave with <Esc>', async () => {
    const { user } = setup()
    await user.keyboard('5gt')
    await user.keyboard('i')
    expect(screen.getByText('INSERT')).toBeInTheDocument()

    await user.keyboard('Ada')
    expect(screen.getByLabelText(/name/)).toHaveValue('Ada')

    await user.keyboard('{Escape}')
    expect(screen.getByText('NORMAL')).toBeInTheDocument()
  })
})
