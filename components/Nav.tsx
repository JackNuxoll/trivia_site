"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface NavProps {
  /** Extra links to render before the auth section */
  links?: { href: string; label: string }[];
}

export default function Nav({ links = [] }: NavProps) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  // Build the sign-in href so we come back to the current page after login
  const loginHref = `/login?redirectTo=${encodeURIComponent(pathname)}`;

  return (
    <>
      <style>{`
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1.5rem, 5vw, 4rem); height: 64px;
          border-bottom: 1px solid #E5E3DC; background: #F8F7F4;
          position: sticky; top: 0; z-index: 50;
          font-family: 'Inter', sans-serif;
        }
        .nav-logo {
          font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700;
          color: #1A1A2E; letter-spacing: -0.5px; text-decoration: none;
        }
        .nav-logo span { color: #4F46E5; }
        .nav-right { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;
          color: #4B5563; text-decoration: none; transition: background 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { background: #EEECFF; color: #4F46E5; }

        /* Auth section */
        .nav-user {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-email {
          font-size: 13px; color: #6B7280; font-weight: 500;
          max-width: 160px; overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 520px) { .nav-email { display: none; } }

        .nav-cta {
          padding: 8px 20px; border-radius: 8px; background: #4F46E5;
          color: #fff; font-size: 14px; font-weight: 600; text-decoration: none;
          transition: background 0.15s; white-space: nowrap;
        }
        .nav-cta:hover { background: #4338CA; }

        .nav-signout {
          padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;
          color: #6B7280; background: transparent; border: 1px solid #E5E3DC;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .nav-signout:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }

        /* Skeleton while loading */
        @keyframes shimmer { from { background-position: -200px 0; } to { background-position: 200px 0; } }
        .nav-skeleton {
          width: 80px; height: 32px; border-radius: 8px;
          background: linear-gradient(90deg, #EFEDE7 25%, #E5E3DC 50%, #EFEDE7 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">Quiz<span>Sharp</span></Link>

        <div className="nav-right">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}

          {loading ? (
            <div className="nav-skeleton" />
          ) : user ? (
            <div className="nav-user">
              <span className="nav-email">{user.email}</span>
              <button className="nav-signout" onClick={handleSignOut}>Sign out</button>
            </div>
          ) : (
            <Link href={loginHref} className="nav-cta">Sign in</Link>
          )}
        </div>
      </nav>
    </>
  );
}
