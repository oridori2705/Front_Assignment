import { Content, DescriptionContainer, List, ListItem, Title } from './styled'

const DragDropDescription = () => {
  return (
    <DescriptionContainer>
      <Title>드래그 앤 드롭 기능 사용법</Title>
      <Content>
        이 기능은 사용자가 항목을 드래그하여 다른 위치로 이동할 수 있도록
        돕습니다. 다음은 사용 방법과 조건입니다:
      </Content>
      <List>
        <ListItem>
          항목을 클릭한 후 드래그하여 원하는 위치로 이동하세요.
        </ListItem>
        <ListItem>Ctrl 키를 누른 채로 여러 항목을 선택할 수 있습니다.</ListItem>
        <ListItem>
          드래그 도중 유효하지 않은 위치로 이동하면 오류 메시지가 표시됩니다.
        </ListItem>
      </List>
      <Title>드래그 앤 드롭 기능 조건</Title>
      <List>
        <ListItem>
          컬럼 내에서 짝수아이템이 연속적으로 나열되어서는 안됩니다.
        </ListItem>
        <ListItem>1번 컬럼에서 3번 컬럼으로의 이동은 금지됩니다.</ListItem>
        <ListItem>
          멀티 드래그시 짝수아이템만 선택하는 방식은 허용되지 않습니다.
        </ListItem>
        <ListItem>
          멀티 드래그시 아이템은 오름차순으로 자동 정렬됩니다.
        </ListItem>
      </List>
      <Content>
        사용 중 문제가 발생하면 오류 메시지를 확인하시기 바랍니다.
      </Content>
    </DescriptionContainer>
  )
}

export default DragDropDescription
