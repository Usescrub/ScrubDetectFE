import {Link} from 'react-router-dom'
type RedirectPageProps = {
    prompt: string,
    action: string,
    path: string
}

export default function RedirectToPage({prompt, action, path}: RedirectPageProps) {
  return (
    <span className="text-[0.75rem] text-light-grey">
      {prompt}{" "}
      <span className="underline font-medium text-black dark:text-white">
        <Link to={path}>{action}</Link>
      </span>
    </span>
  );
}
