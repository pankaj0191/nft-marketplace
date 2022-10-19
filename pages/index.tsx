import Layout from "../components/Layout"
import Home from "../components/Home"

export default function BaseHome() {
  return (
    <Layout noHome={false}>
      <Home />
    </Layout>
  )
}
