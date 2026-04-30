import { Link } from '@remix-run/react';
export default function Index() {
  return <div className='shell'><aside className='sidebar'><h3>Medical Record</h3><Link to='/doctor-visits'>Doctor Visits</Link><Link to='/lab-results'>Lab Results</Link><div style={{marginTop:'auto'}}><Link to='/catalog'>Manage Catalog</Link></div></aside><main className='content'><h1>Personal Medical Record</h1><p>Use the sidebar to manage your records.</p></main></div>;
}
