import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'

import type { Operation } from 'models/operation'

import { OperationCard } from './OperationCard'

interface RowProps {
  operations: Operation[]
  index: number
  setSize: (index: number, size: number) => void
  windowWidth: number
}

const Row: React.FC<RowProps> = ({
  operations,
  index,
  setSize,
  windowWidth,
}) => {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height)
    }
  }, [setSize, index, windowWidth])

  return (
    <div className="mb-4 sm:mb-2 last:mb-0" ref={rowRef}>
      <OperationCard operation={operations[index]} key={operations[index].id} />
    </div>
  )
}

export function useWindowResize() {
  const [size, setSize] = useState([0, 0])

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

interface OperationVirtualListProps {
  operations: Operation[]
}

const CONTAINER_STYLES: React.CSSProperties = {
  height: '1200px',
}

export const OperationVirtualList: React.FC<OperationVirtualListProps> = ({
  operations,
}) => {
  const listRef = useRef<List>(null)

  const sizeMap = useRef<Record<number, number>>({})
  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size }
    listRef.current?.resetAfterIndex(index)
  }, [])

  const [windowWidth] = useWindowResize()
  return operations.length > 10 ? (
    <div style={CONTAINER_STYLES}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            itemSize={(index) => sizeMap.current[index] || 50}
            height={height}
            width={width}
            itemCount={operations.length}
          >
            {({ index, style }) => {
              return (
                <div style={style}>
                  <Row
                    operations={operations}
                    index={index}
                    setSize={setSize}
                    windowWidth={windowWidth}
                  />
                </div>
              )
            }}
          </List>
        )}
      </AutoSizer>
    </div>
  ) : (
    <>
      {operations.map((item) => (
        <OperationCard operation={item} key={item.id} />
      ))}
    </>
  )
}
