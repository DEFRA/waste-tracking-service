import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const token = await getToken({ req });
    const invitationToken = req.query.invitation;

    let hostname = req.headers.host || '';
    let protocol = 'https';

    if (hostname.indexOf('localhost') === 0) {
      hostname = 'localhost:3000';
      protocol = 'http';
    }

    const apiUrl = `${protocol}://${hostname}/api`;

    if (token && invitationToken) {
      const fetchData = async () => {
        try {
          fetch(
            `${apiUrl}/privatebeta/users?invitationToken=${invitationToken}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token.id_token}`,
              },
            }
          ).then((response) => {
            console.log(response);
            if (response.ok) {
              res.redirect(307, '/export/?context=granted');
            } else {
              res.redirect(307, '/?context=error');
            }
          });
        } catch (e) {
          console.error(e);
        }
      };
      await fetchData();
    } else {
      res.redirect(307, '/?context=unauthorized');
    }
  } else {
    res.status(401);
  }
}
