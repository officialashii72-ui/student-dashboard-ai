
import { Link } from 'react-router-dom';

export default function GuestBanner() {
  return (
    <div className="bg-blue-500 text-white text-center p-2">
      You are in guest mode.{' '}
      <Link to="/signup" className="underline">Sign up</Link> to unlock all features.
    </div>
  );
}
