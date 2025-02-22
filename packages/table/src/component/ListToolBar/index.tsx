import React, { useContext } from 'react';
import { Tooltip, Space, Input, ConfigProvider, Tabs } from 'antd';
import { useIntl } from '@ant-design/pro-provider';
import { TooltipProps } from 'antd/lib/tooltip';
import { TabPaneProps } from 'antd/lib/tabs';
import classNames from 'classnames';
import { SearchProps } from 'antd/es/input';
import { LabelIconTip } from '@ant-design/pro-utils';
import HeaderMenu, { ListToolBarHeaderMenuProps } from './HeaderMenu';

import './index.less';

export interface ListToolBarSetting {
  icon: React.ReactNode;
  tooltip?: string;
  key?: string;
  onClick?: (key?: string) => void;
}

/**
 * antd 默认直接导出了 rc 组件中的 Tab.Pane 组件。
 */
type TabPane = TabPaneProps & {
  key?: string;
};

export interface ListToolBarTabs {
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  items?: TabPane[];
}

export type ListToolBarMenu = ListToolBarHeaderMenuProps;

type SearchPropType = SearchProps | React.ReactNode | boolean;
type SettingPropType = React.ReactNode | ListToolBarSetting;

export interface ListToolBarProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * 标题
   */
  title?: React.ReactNode;
  /**
   * 副标题
   */
  subTitle?: React.ReactNode;
  /**
   * @deprecated 你可以使用 tooltip，这个更改是为了与 antd 统一
   */
  tip?: string | TooltipProps;
  /**
   * 标题提示
   */
  tooltip?: string | TooltipProps;
  /**
   * 搜索输入栏相关配置
   */
  search?: SearchPropType;
  /**
   * 搜索回调
   */
  onSearch?: (keyWords: string) => void;
  /**
   * 工具栏右侧操作区
   */
  actions?: React.ReactNode[];
  /**
   * 工作栏右侧设置区
   */
  settings?: SettingPropType[];
  /**
   * 是否多行展示
   */
  multipleLine?: boolean;
  /**
   * 过滤区，通常配合 LightFilter 使用
   */
  filter?: React.ReactNode;
  /**
   * 标签页配置，仅当 `multipleLine` 为 true 时有效
   */
  tabs?: ListToolBarTabs;
  /**
   * 菜单配置
   */
  menu?: ListToolBarMenu;
}

/**
 * 获取配置区域 DOM Item
 * @param setting 配置项
 */
function getSettingItem(setting: SettingPropType) {
  if (React.isValidElement(setting)) {
    return setting;
  }
  if (setting) {
    const settingConfig: ListToolBarSetting = setting as ListToolBarSetting;
    const { icon, tooltip, onClick, key } = settingConfig;
    if (icon && tooltip) {
      return (
        <Tooltip title={tooltip}>
          <span
            key={key}
            onClick={() => {
              if (onClick) {
                onClick(key);
              }
            }}
          >
            {icon}
          </span>
        </Tooltip>
      );
    }
    return icon;
  }
  return null;
}

const ListToolBar: React.FC<ListToolBarProps> = ({
  prefixCls: customizePrefixCls,
  title,
  subTitle,
  tip,
  tooltip,
  className,
  style,
  search,
  onSearch,
  multipleLine = false,
  filter,
  actions = [],
  settings = [],
  tabs = {},
  menu,
}) => {
  const intl = useIntl();

  /**
   * 获取搜索栏 DOM
   * @param search 搜索框相关配置
   */
  const getSearchInput = (searchObject: SearchPropType) => {
    if (!searchObject) {
      return null;
    }
    if (React.isValidElement(searchObject)) {
      return searchObject;
    }
    return (
      <Input.Search
        style={{ width: 200 }}
        placeholder={intl.getMessage('tableForm.inputPlaceholder', '请输入')}
        onSearch={onSearch}
        {...(searchObject as SearchProps)}
      />
    );
  };

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-table-list-toolbar', customizePrefixCls);

  /**
   * 根据配置自动生成的查询框
   */
  const searchNode: React.ReactNode = getSearchInput(search);
  /**
   * 轻量筛选组件
   */
  const filtersNode = filter ? <div className={`${prefixCls}-filter`}>{filter}</div> : null;

  /**
   * 有没有 title，判断了多个场景
   */
  const hasTitle = menu || title || subTitle || tooltip || tip;

  return (
    <div style={style} className={classNames(`${prefixCls}`, className)}>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-left`}>
          {menu && <HeaderMenu {...menu} prefixCls={prefixCls} />}
          <div className={`${prefixCls}-title`}>
            <LabelIconTip tooltip={tooltip || tip} label={title} subTitle={subTitle} />
          </div>
          {!hasTitle && searchNode && <div className={`${prefixCls}-search`}>{searchNode}</div>}
        </div>
        <Space className={`${prefixCls}-right`}>
          {hasTitle && searchNode && <div className={`${prefixCls}-search`}>{searchNode}</div>}
          {!multipleLine && filtersNode}
          <Space align="center">{actions}</Space>
          {settings.length > 0 && (
            <Space size={24} align="center" className={`${prefixCls}-setting-items`}>
              {settings.map((setting, index) => {
                const settingItem = getSettingItem(setting);
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index} className={`${prefixCls}-setting-item`}>
                    {settingItem}
                  </div>
                );
              })}
            </Space>
          )}
        </Space>
      </div>
      {multipleLine && (
        <div className={`${prefixCls}-extra-line`}>
          {tabs.items && tabs.items.length ? (
            <Tabs onChange={tabs.onChange} tabBarExtraContent={filtersNode}>
              {tabs.items.map((tab) => (
                <Tabs.TabPane {...tab} />
              ))}
            </Tabs>
          ) : (
            filtersNode
          )}
        </div>
      )}
    </div>
  );
};

export default ListToolBar;
