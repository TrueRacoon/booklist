import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import getBooksList from './api/getBooksList';
import { IBook } from './models/book';
import Books from './components/Books/Books';
import TagFilter from './components/TagFilter/TagFilter';
import './App.css';
import Tabs from './components/Tabs/Tabs';
import TabType from './consts/TabType';

const App: React.FC = (): JSX.Element => {
  const { currentTab = TabType.ToRead } = useParams();

  const [searchParams] = useSearchParams();
  const tagsParam = searchParams.get('tags');

  const [booksList, setBooksList] = useState<IBook[]>([]);
  const [filteredBooksList, setFilteredBooksList] = useState<IBook[]>([]);

  const [inProgressIds, setInProgressIds] = useState<string[]>(
    () => (
      JSON.parse(localStorage.getItem('inProgressIds') ?? '[]')
    ),
  );

  const [doneIds, setDoneIds] = useState<string[]>(
    () => (
      JSON.parse(localStorage.getItem('doneIds') ?? '[]')
    ),
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await getBooksList();
        setBooksList(response.data.items);
      } catch (e) {
        console.error('Error while getting books list');
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem('inProgressIds', JSON.stringify(inProgressIds));
  }, [inProgressIds]);

  useEffect(() => {
    localStorage.setItem('doneIds', JSON.stringify(doneIds));
  }, [doneIds]);

  const isCurrentTabContainsBook = (bookId: string): boolean => (
    (
      currentTab === TabType.InProgress
      && inProgressIds.includes(bookId)
    )
    || (
      currentTab === TabType.Done
      && doneIds.includes(bookId)
    )
    || (
      currentTab === TabType.ToRead
      && !inProgressIds.includes(bookId)
      && !doneIds.includes(bookId)
    )
  );

  const isBookContainsAllTagFilters = (bookTags: string[], filters: string[]): boolean => (
    filters.every((filter) => (
      bookTags.includes(filter)
    ))
  );

  useEffect(() => {
    const filters = tagsParam?.split(',') ?? [];
    setFilteredBooksList(
      booksList.filter((book) => (
        isCurrentTabContainsBook(book.id)
        && isBookContainsAllTagFilters(book.tags, filters)
      )),
    );
  }, [booksList, currentTab, tagsParam]);

  const tabsList = [
    {
      text: `To read (${booksList.length - inProgressIds.length - doneIds.length})`,
      link: '',
      isCurrent: currentTab === TabType.ToRead,
    },
    {
      text: `In progress (${inProgressIds.length})`,
      link: TabType.InProgress,
      isCurrent: currentTab === TabType.InProgress,
    },
    {
      text: `Done (${doneIds.length})`,
      link: TabType.Done,
      isCurrent: currentTab === TabType.Done,
    },
  ];

  const toggleBookStatus = (id: string): void => {
    if (inProgressIds.includes(id)) {
      setDoneIds([...doneIds, id]);
      setInProgressIds(
        inProgressIds.filter((inProgressId) => (
          inProgressId !== id
        )),
      );
    } else if (doneIds.includes(id)) {
      setDoneIds(
        doneIds.filter((doneId) => (
          doneId !== id
        )),
      );
    } else {
      setInProgressIds([...inProgressIds, id]);
    }
    setFilteredBooksList(
      filteredBooksList.filter((book) => (
        book.id !== id
      )),
    );
  };

  return (
    <div className="app">
      <Tabs tabsList={tabsList} tagsParam={tagsParam}>
        <TagFilter />
        <div className="app__books">
          <Books booksList={filteredBooksList} toggleBookStatus={toggleBookStatus} />
        </div>
      </Tabs>
    </div>
  );
};

export default App;
