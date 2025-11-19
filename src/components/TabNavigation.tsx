import { memo, useCallback } from 'react';
import { Tab } from '../interfaces/Tab.interface';
import styles from '../styles/TabNavigation.module.css';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation = memo(({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  const handleTabClick = useCallback(
    (tabId: string) => {
      onTabChange(tabId);
    },
    [onTabChange]
  );

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => handleTabClick(tab.id)}
          type="button"
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
          <span className={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;

