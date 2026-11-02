function SearchBar({ inputPlaceholder = '', options = [], submitLabel = '', onSubmit, className = '' }) {
  return (
    <form className={`card mx-auto -mt-8 max-w-4xl bg-base-100 p-4 shadow-lg md:p-5 ${className}`} onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label className="input input-bordered flex items-center gap-2">
          <span aria-hidden="true">⌕</span>
          <input type="search" className="grow" placeholder={inputPlaceholder} />
        </label>
        <select className="select select-bordered w-full md:w-44" defaultValue="">
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
      </div>
    </form>
  )
}

export default SearchBar
