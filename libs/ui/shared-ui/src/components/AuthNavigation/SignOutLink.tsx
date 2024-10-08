'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WellKnownObj {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  response_modes_supported: Array<string>;
  response_types_supported: Array<string>;
  scopes_supported: Array<string>;
  subject_types_supported: Array<string>;
  id_token_signing_alg_values_supported: Array<string>;
  token_endpoint_auth_methods_supported: Array<string>;
  claims_supported: Array<string>;
}

interface SignOutLinkProps {
  wellKnownObj: WellKnownObj | string;
}

export function SignOutLink({ wellKnownObj }: SignOutLinkProps): JSX.Element {
  const router = useRouter();
  async function handleSignOut(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    await signOut();
    if (typeof wellKnownObj === 'object') {
      router.push(wellKnownObj.end_session_endpoint);
    }
  }
  return (
    <Link
      href={'#'}
      onClick={(e: React.MouseEvent) => handleSignOut(e)}
      className="govuk-link govuk-link--inverse"
    >
      Sign out
    </Link>
  );
}
