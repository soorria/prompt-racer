const BrandLoadingIndicator = () => {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 mb-1">Loading</p>
      <div className="inline-grid font-display text-sm place-items-center h-5 w-16 ">
        <div className="animate-loading inline-block relative col-start-1 row-start-1 -top-1">
          PROMPT
        </div>
        <div
          className="animate-loading text-primary relative col-start-1 row-start-1 top-1"
          style={{ animationDelay: "0.1s" }}
        >
          RACER
        </div>
      </div>
    </div>
  )
}

export default BrandLoadingIndicator
