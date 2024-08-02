export interface Item {
  id: number
  content: string
}

export interface Column {
  id: string
  title: string
  items: Item[]
}

export const getItems = (count: number): Record<string, Column> => {
  const columns: Record<string, Column> = {}

  // 첫 번째 컬럼의 아이템 생성
  const firstColumnItems: Item[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    content: `item-${index + 1}`
  }))

  // 컬럼 생성
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
