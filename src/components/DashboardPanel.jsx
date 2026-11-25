import { useAppState } from '../AppStateContext'

export default function DashboardPanel({ panelId, title, count, highlightCount, children }) {
  const { openDashboardPanels, setDashboardPanelOpen } = useAppState()
  const countClass = highlightCount && count > 0
    ? 'badge badge-warning'
    : 'text-sm font-normal text-base-content/60'

  return <details className="rounded-box border border-base-300 bg-base-100" open={openDashboardPanels[panelId] ?? false} onToggle={(event) => setDashboardPanelOpen(panelId, event.currentTarget.open)}>
    <summary className="cursor-pointer p-5 text-xl font-bold">{title}<span className={`ml-2 ${countClass}`}>({count})</span></summary>
    <div className="grid gap-3 px-5 pb-5">{children}</div>
  </details>
}
