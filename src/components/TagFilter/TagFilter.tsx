import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tag from '../Tag/Tag';
import './TagFilter.css';

export default (): JSX.Element | null => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTags(searchParams.get('tags')?.split(',') ?? []);
  }, [searchParams]);

  const onClear = (): void => (
    setSearchParams(
      {},
      { replace: true },
    )
  );

  if (tags.length === 0) {
    return (
      <div className="tag-filter">
        <span className="tag-filter__label">
          There are no filters by tags
        </span>
      </div>
    );
  }

  return (
    <div className="tag-filter">
      <span className="tag-filter__label">Filters by tags:</span>
      {
        tags.map((tag) => (
          <Tag key={tag} text={tag} />
        ))
      }
      <button
        type="button"
        onClick={() => onClear()}
        className="tag-filter__clear-button"
      >
        (clear)
      </button>
    </div>
  );
};
