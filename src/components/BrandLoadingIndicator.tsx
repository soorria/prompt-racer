const BrandLoadingIndicator = () => {
  return (
    <div className="text-center">
      <p className="animate-pulse text-9xl text-gray-400/10 mb-1">Loading</p>
      <div className="inline-grid font-display text-9xl place-items-center h-5 w-16 ">
        <div className="animate-loading inline-block relative -top-28">PROMPT</div>
        <div
          className="animate-loading text-primary relative -top-52"
          style={{ animationDelay: "0.1s" }}
        >
          RACER
        </div>
      </div>
    </div>
  )
}

export default BrandLoadingIndicator
