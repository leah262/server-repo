import useLastPath from '../hooks/useLastPath'

function Home() {
  useLastPath()
  
  return (
    <div className="welcome-message">
      <h2>Welcome!</h2>
      <p>lets get started!.</p>
    </div>
  )
}

export default Home
