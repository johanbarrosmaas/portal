import { NextApiRequest, NextApiResponse } from "next";
import { Empresa } from "../../../client/models/pilares";
import { withAuth } from "../../../lib/firebase-admin/tools";
import { addDocument, queryColection } from "../../../lib/persistence/firebase";

const colectionName = 'empresas';

async function handlePost(data: Empresa) {
    console.log(data);
    if (data) {
        data.apelido = data.apelido == null ? data.cnpj : data.apelido.toLowerCase().split(' ').join('-');
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
    const data = await queryColection(colectionName);
    if (data instanceof Array) {
        console.log(data);
        return data;
    }
} 

export async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = {}

    if (session) {
        try {
            if (req.method == 'POST') res.json(await handlePost(JSON.parse(req.body)).catch(reason => {throw reason}));
            if (req.method == 'GET') res.json(await handleGet().catch(reason => {throw reason}));
        } catch (reason: any) {
            res.status(400).json({ errors: reason.message })
        }
    } else {
        res.send({
          error: "You must be sign in to view the protected content on this page.",
        });
    }
}

export default withAuth(handle);;
