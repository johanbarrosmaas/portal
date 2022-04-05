import { NextApiRequest, NextApiResponse } from "next";
import { withAuth, IUserValidated } from '../../../lib/firebase-admin/tools';
import { addDocument, queryColection } from "../../../lib/persistence/firebase";

const colectionName = 'protocolos';

async function handlePost(data: any) {
    console.log(data);
    if (data) {
        const doc = await addDocument<any>(colectionName, data).catch(reason => {
            console.error(reason);
        });

        if (doc) {
            console.log(doc);
            return { id: doc.id, ...data };
        }
    }
}

async function handleGet(session?: any | null) {
    if (session == null) return new Array();
    if (session.email == null) return new Array();

    const data = await queryColection(colectionName, {
        user: session.email
    });
    if (data instanceof Array) {
        console.log(data);
        return data;
    }
} 

export async  function handle(req: NextApiRequest & { userValidated: IUserValidated }, res: NextApiResponse) {
    console.log(req);
    const session = req.userValidated;

    if (session) {
        try {
            if (req.method == 'POST') res.json(await handlePost(JSON.parse(req.body)).catch(reason => {throw reason}));
            if (req.method == 'GET') res.json(await handleGet(session).catch(reason => {throw reason}));
        } catch (reason: any) {
            res.status(400).json({ errors: reason.message })
        }
    } else {
        res.send({
          error: "You must be sign in to view the protected content on this page.",
        });
    }
}

export default withAuth(handle);
