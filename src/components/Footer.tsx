import { Fragment } from "react"
import { FEEDBACK_FORM_URL } from "~/lib/feedback"

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
    <footer className="flex flex-col sm:flex-row justify-center p-2 gap-1 text-muted-foreground text-xs items-center">
      <span>
        Made with ❤️ by{" "}
        {creatorsInOrder.map((creator, i) => (
          <Fragment key={creator.link}>
            <a
              href={`${creator.link}?ref=prompt-racer`}
              target="_blank"
              className="transition hover:text-primary underline"
            >
              {creator.name}
            </a>
            {i === 0 ? <span> and </span> : i === creators.length - 1 ? "" : ", "}
          </Fragment>
        ))}
      </span>
      <span className="hidden sm:inline">|</span>
      <a href={FEEDBACK_FORM_URL} target="_blank" className="underline">
        Feedback & suggestions
      </a>
    </footer>
  )
}

export default Footer
