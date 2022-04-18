import { ReactNode } from 'react';

import './style.scss';

type QuestionProps = {
  content: string;
  author: { 
    name: string;
    avatar: string;
  };
  children?: ReactNode;
}

export function Question({ content, author:{ avatar, name }, children }: QuestionProps) {
  return (
    <div className="question">
      <p>{ content }</p>
      <footer>
        <div className="user-info">
          <img src={ avatar } alt={ name } />
          <span>{ name }</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}