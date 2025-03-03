import { Container,Col,Row } from "react-bootstrap"


const Footer = () => {
  const year=new Date().getFullYear()
  console.log(year)

  return (
    <Container>
      <Row className="text-center py-3 footer">
        <Col>
          Copyright &copy;{year}
        </Col>
      </Row>
    </Container>
  )
}
export default Footer