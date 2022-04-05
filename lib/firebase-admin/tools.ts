import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextApiResponse, NextApiRequest } from 'next';

export interface IUserValidated {
    uid: string;
    email: string;
}
 
const appAdmin = getApps().length ? getApp() : initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
});

export async function verifyToken(token: string) {
    const decodedToken = await getAuth(appAdmin).verifyIdToken(token).catch(reason => {
        console.log('Token error', [reason]);
        throw reason;
    });

    if (!!decodedToken) {
        if (decodedToken.email == null) return Promise.reject('A conta precisa ter um email vinculado!');
        if (decodedToken.email == null) return Promise.reject('Email ainda não verificado, verifique sua caixa de entrada!');
        if (!['@mind.inf.br','bioma.ind.br','simbiose-agro.com.br'].some(postfix => { return decodedToken.email?.endsWith(postfix)})) return Promise.reject('Conta sem permissão de acesso!');
        return decodedToken;
    } else {
        return Promise.reject('Não foi possível decodificar o token');
    }
}

export function withAuth(handler: any) {
    return async (req: NextApiRequest & { userValidated: IUserValidated }, res: NextApiResponse) => {
        if (req.url?.includes('/api')) {
            const token = req.headers.authorization?.replace('Bearer ','');

            if (!(token == null)) {
                verifyToken(token).then((decodedToken: any) => {
                    const { uid, email } = decodedToken;
                    req['userValidated'] = { uid, email };
                    handler(req, res);
                }).catch(reason => {
                    console.log('Middleware error', [reason]);
                    res.status(401).json({ error: 'Você não está autorizado a acessar estes dados!' });
                });

                //return handler(req, res);
            } else {
                res.status(401).json({ error: 'Necessário informar um token!' });
            }
        } else {
            handler(req, res);
        }
    };
}
