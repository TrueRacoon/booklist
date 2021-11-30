import { Link } from 'react-router-dom';
import React from 'react';
import './Tabs.css';
import AppName from '../../consts/AppName';

interface ITab {
  text: string;
  link: string;
  isCurrent: boolean;
}

interface ITabsProps {
  tabsList: ITab[];
  tagsParam: string | null;
  children: React.ReactNode;
}

export default ({ tabsList, tagsParam, children }: ITabsProps): JSX.Element => (
  <div className="tabs">
    <nav className="tabs__navigation">
      {
        tabsList.map((tab) => (
          <Link
            to={`/${AppName}${tab.link}${tagsParam ? `?tags=${encodeURIComponent(tagsParam)}` : ''}`}
            key={tab.link}
            className={`tabs__link${tab.isCurrent ? ' tabs__link_current' : ''}`}
            style={{ width: `${100 / tabsList.length}%` }}
          >
            {tab.text}
          </Link>
        ))
      }
    </nav>
    <div className="tabs__content">{children}</div>
  </div>
);
