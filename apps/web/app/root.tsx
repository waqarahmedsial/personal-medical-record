import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import styles from './styles/app.css?url';
export const links = () => [{ rel: 'stylesheet', href: styles }];
export default function App() {
  return <html><head><Meta /><Links /></head><body><Outlet /><Scripts /></body></html>;
}
