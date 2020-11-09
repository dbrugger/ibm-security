/**
 * @file Combo button.
 * @copyright IBM Security 2019 - 2020
 */

import { ChevronDown16, ChevronUp16 } from '@carbon/icons-react';

import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { createElement, useState } from 'react';

import { carbonPrefix, getComponentNamespace } from '../../globals/namespace';

import Button from '../Button';
import OverflowMenu from '../OverflowMenu';
import OverflowMenuItem from '../OverflowMenuItem';
import { TooltipDirection } from '../IconButton/IconButton';

import { namespace as buttonNamespace } from '../Button/Button';

export const namespace = getComponentNamespace('combo-button');

const ComboButton = ({
  children,
  className,
  direction,
  menuOffset,
  menuOffsetFlip,
  selectorPrimaryFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const childrenArray = React.Children.toArray(children).filter(Boolean);

  // Save first child (e.g., primary action) to use as a `Button`:
  const button = childrenArray[0];
  // Need to explicitly define props, versus using `...rest`,
  // because otherwise unused `OverflowMenuItem`-related props from
  // may trigger invalid DOM warnings.
  const primaryActionWithProps = (
    <Button
      className={classnames(button.props.className, `${namespace}--primary`)}
      disabled={button.props.disabled}
      href={button.props.href}
      iconDescription={button.props.iconDescription}
      kind="primary"
      id={button.props.id}
      onClick={button.props.onClick}
      renderIcon={button.props.renderIcon}
      type="button"
    >
      <span
        className={`${carbonPrefix}text-truncate--end`}
        title={button.props.children}
      >
        {button.props.children}
      </span>
    </Button>
  );

  // Save remaining children to be displayed in the `OverflowMenu`:
  let overflowItems;
  let overflowMenuItemWithProps;
  if (childrenArray.length > 1) {
    overflowItems = childrenArray.slice(1);

    // Create `OverflowMenuItem` components:
    overflowMenuItemWithProps = overflowItems.map((item, index) => {
      // Need to explicitly define props, versus using `...rest`,
      // because otherwise unused `Button`-related props from
      // may trigger invalid DOM warnings.
      const {
        children,
        className,
        disabled,
        href,
        iconDescription,
        id,
        onClick,
        renderIcon: Icon,
        ...other
      } = item.props;

      return (
        <OverflowMenuItem
          className={classnames(className, `${namespace}-item__wrapper`)}
          disabled={disabled}
          href={href}
          itemText={
            <>
              <span
                className={`${carbonPrefix}text-truncate--end`}
                title={children}
              >
                {children}
              </span>
              {Icon && <Icon aria-label={iconDescription} />}
            </>
          }
          id={id}
          key={id || index}
          onClick={onClick}
          {...other}
        />
      );
    });
  }

  const renderOverflowMenuIcon = () =>
    createElement(isOpen ? ChevronUp16 : ChevronDown16, {
      className: `${namespace}__icon`,
    });

  return (
    <div
      className={classnames(namespace, className)}
      data-floating-menu-container
    >
      <div className={`${namespace}__group`}>
        {primaryActionWithProps}

        {overflowMenuItemWithProps !== undefined && (
          <OverflowMenu
            className={classnames(
              // Button-specific classes for styling:
              buttonNamespace,
              `${carbonPrefix}btn`,
              `${carbonPrefix}btn--primary`,

              // Button as a child of combo button:
              `${namespace}__button`,

              // Overflow menu as a child of combo button:
              `${namespace}__overflow-menu`
            )}
            direction={direction}
            menuOffset={() => {
              const { pageYOffset } = window;

              return {
                top:
                  direction === TooltipDirection.TOP
                    ? pageYOffset
                    : pageYOffset * -1,
                ...(typeof menuOffset === 'function'
                  ? menuOffset()
                  : menuOffset),
              };
            }}
            menuOffsetFlip={menuOffsetFlip}
            menuOptionsClass={`${carbonPrefix}list-box__menu`}
            onClick={() => setIsOpen(!isOpen)}
            onClose={() => setIsOpen(false)}
            renderIcon={renderOverflowMenuIcon}
            selectorPrimaryFocus={selectorPrimaryFocus}
          >
            {overflowMenuItemWithProps}
          </OverflowMenu>
        )}
      </div>
    </div>
  );
};

ComboButton.propTypes = {
  /** @type {node} The child nodes. */
  children: PropTypes.node.isRequired,

  /** @type {string} Extra classes to add. */
  className: PropTypes.string,

  /** @type {string} Overflow menu direction. */
  direction: PropTypes.oneOf([TooltipDirection.TOP, TooltipDirection.BOTTOM]),

  /**
   * The adjustment in position applied to the floating menu.
   */
  menuOffset: PropTypes.oneOfType([
    PropTypes.shape({
      top: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
      left: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
    }),
    PropTypes.func,
  ]),

  /**
   * The adjustment in position applied to the floating menu.
   */
  menuOffsetFlip: PropTypes.oneOfType([
    PropTypes.shape({
      top: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
      left: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
    }),
    PropTypes.func,
  ]),

  /**
   * Specify a CSS selector that matches the DOM element that should
   * be focused when the OverflowMenu opens
   */
  selectorPrimaryFocus: PropTypes.string,
};

ComboButton.defaultProps = {
  className: '',
  direction: TooltipDirection.TOP,
  menuOffset: () => ({
    left: 'auto',
  }),
  menuOffsetFlip: undefined,
  selectorPrimaryFocus: '[data-overflow-menu-primary-focus]',
};

export default ComboButton;
