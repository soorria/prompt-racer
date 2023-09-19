import { Fragment } from "react"

const creators: { name: string; link: string }[] = [
  {
    name: "Soorria",
    link: "https://soorria.com",
  },
  { name: "Eric", link: "https://ericpaul.me" },
]

const Footer = () => {
  const creatorsInOrder = Math.random() > 0.5 ? creators : [...creators].reverse()

  return (
    <footer className="flex justify-center p-2 gap-1 text-muted-foreground text-xs">
      Made with ❤️ by{" "}
      {creatorsInOrder.map((creator, i) => (
        <Fragment key={creator.link}>
          <a
            href={`${creator.link}?ref=prompt-racer`}
            target="_blank"
            className="transition hover:text-primary"
          >
            {creator.name}
          </a>
          {i === 0 ? <span> and </span> : i === creators.length - 1 ? "" : ", "}
        </Fragment>
      ))}
    </footer>
  )
}

export default Footer
