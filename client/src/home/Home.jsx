import ContentLibrary from '../components/ContentLibrary'
import AccessPanel from '../components/AccessPanel'
import Diagnostics from '../components/Diagnostics'
import { Stack } from '@mui/material';
import './Home.scss';

function Home({handleLogout}) {
  const stackSpacing = 2;

  return (
    <div className="home">
      <Stack direction="row" spacing={stackSpacing} justifyContent={"center"}>
        <ContentLibrary />
        <AccessPanel/>
      </Stack>
      <Diagnostics/>
    </div>
  );
}

export default Home;