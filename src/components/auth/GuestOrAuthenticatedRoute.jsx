
import { useAuth } from '../../context/AuthContext';
import Layout from '../layout/Layout';
import GuestBanner from './GuestBanner';

export default function GuestOrAuthenticatedRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Layout>{children}</Layout>;
  }

  return (
    <Layout>
      <GuestBanner />
      {children}
    </Layout>
  );
}
