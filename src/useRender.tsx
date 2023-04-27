import React, { useCallback } from 'react';
import type {
  CSSMatrixPrefix,
  GLMatrixType,
  MappableChildren,
  MultiplicationOrder,
  TransformChildProps,
  TransformChildren,
} from './types';

type UseRenderChildParams<Matrix extends GLMatrixType> = {
  matrixString: string;
  matrixWorld: React.RefObject<Matrix>;
  multiplicationOrder: MultiplicationOrder;
};

type UseRenderParams<Matrix extends GLMatrixType> = {
  cssMatrixPrefix: CSSMatrixPrefix;
  matrixWorld: React.RefObject<Matrix>;
  multiplicationOrder: MultiplicationOrder;
};

const useRenderChild = <Matrix extends GLMatrixType>({
  matrixWorld,
  matrixString,
  multiplicationOrder,
}: UseRenderChildParams<Matrix>) => {
  return useCallback(
    (child: React.ReactElement): JSX.Element | null => {
      if (!child) {
        return null;
      }

      const childStyle = child.props.style || {};
      const style = {
        ...childStyle,
        transform: matrixString,
      };

      const childProps: TransformChildProps<Matrix> = {
        style,
      };

      if (typeof child.type !== 'string') {
        childProps.parentMatrixWorld = matrixWorld.current ?? undefined;
        childProps.multiplicationOrder = multiplicationOrder;
      }

      return React.cloneElement(child, childProps);
    },
    [matrixString, matrixWorld, multiplicationOrder],
  );
};

export const useRender = <Matrix extends GLMatrixType>({
  cssMatrixPrefix,
  matrixWorld,
  multiplicationOrder,
}: UseRenderParams<Matrix>) => {
  const matrixString = `${cssMatrixPrefix}(${matrixWorld.current?.join(',')})`;

  const renderChild = useRenderChild<Matrix>({
    matrixWorld,
    matrixString,
    multiplicationOrder,
  });

  return useCallback(
    (children: TransformChildren<Matrix>): JSX.Element | null => {
      if (!children) {
        return null;
      }

      if (typeof children === 'function') {
        return children({
          parentMatrixWorld: matrixWorld.current ?? undefined,
          multiplicationOrder,
          style: {
            transform: matrixString,
          },
        });
      }

      // TODO: Bug with react types? Can't this accept React.ReactNode(s)
      // not just React.ReactElement(s)?
      return (
        <>{React.Children.map(children as MappableChildren, renderChild)}</>
      );
    },
    [matrixString, matrixWorld, multiplicationOrder, renderChild],
  );
};
