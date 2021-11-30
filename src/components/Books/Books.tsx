import React, { ReactNode } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'react-router-dom';
import { IBook } from '../../models/book';
import Tag from '../Tag/Tag';
import './Books.css';
import TabType from '../../consts/TabType';

interface IBooksProps {
  booksList: IBook[];
  toggleBookStatus: (id: string) => void;
}

export default ({ booksList, toggleBookStatus }: IBooksProps): JSX.Element => {
  const { currentTab = TabType.ToRead } = useParams();

  const getToggleStatusText = (): string => {
    if (currentTab === TabType.InProgress) return 'mark as done';
    if (currentTab === TabType.Done) return 'mark to read';
    return 'start reading';
  };

  const toggleStatusText = getToggleStatusText();

  const itemContent = (index: number, book: IBook): ReactNode => (
    <article className="book">
      <div className="book__author-block">
        <span>{book.author}</span>
        <button
          type="button"
          onClick={() => toggleBookStatus(book.id)}
          className="book__toggle-button"
        >
          {toggleStatusText}
        </button>
      </div>
      <div className="book__title">{book.title}</div>
      <div className="book__description">{book.description}</div>
      {
        Array.from(
          new Set(book.tags),
        ).map((tag) => (
          <Tag key={tag} text={tag} />
        ))
      }
    </article>
  );

  if (booksList.length === 0) {
    return (
      <div className="books__empty-list-label">
        There are no books with selected filters
      </div>
    );
  }

  return (
    <Virtuoso data={booksList} itemContent={itemContent} />
  );
};
