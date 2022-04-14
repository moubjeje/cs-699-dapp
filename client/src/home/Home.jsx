import ContentLibrary from '../components/ContentLibrary'

function Home({handleLogout}) {

  return (
    <div className="home">
      <div className="contentLibrary">
        <ContentLibrary/>
      </div>
    </div>
  );
}

export default Home;