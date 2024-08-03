export interface Item {
  id: number
  content: string
  isSelected: boolean
}

export interface Column {
  id: string
  title: string
  items: Item[]
}

export interface ColumnMap {
  [key: string]: Column
}

export const getItems = (count: number): ColumnMap => {
  const columns: ColumnMap = {}

  const firstColumnItems: Item[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    content: `${index + 1}번`,
    isSelected: false
  }))

  for (let i = 1; i <= count; i++) {
    const columnId = `column-${i}`
    columns[columnId] = {
      id: columnId,
      title: `Column ${i}`,
      items: i === 1 ? firstColumnItems : []
    }
  }

  return columns
}
export const reorder = (
  list: Item[],
  startIndex: number,
  endIndex: number
): Item[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const GRID = 8
