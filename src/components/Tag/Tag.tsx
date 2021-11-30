import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './Tag.css';

interface ITagProps {
  text: string;
}

export default ({ text }: ITagProps): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tags = searchParams.get('tags');

  const addTag = (tag: string): void => {
    setSearchParams(
      {
        tags: Array.from(
          new Set([...tags?.split(',') ?? [], tag]),
        ).join(','),
      },
    );
  };

  return (
    <button
      type="button"
      className="tag"
      onClick={() => addTag(text)}
    >
      #
      {text}
    </button>
  );
};
