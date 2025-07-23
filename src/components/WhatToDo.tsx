type WhatToDoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  prompt: string;
};

export default function WhatToDo({ prompt, ...props }: WhatToDoProps) {
  return (
    <div className="flex gap-2 items-center">
      <img {...props} />
      <p>{prompt}</p>
    </div>
  );
}
